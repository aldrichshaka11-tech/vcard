"""
api/payments.py — PhonePe PG v2 (OAuth2) billing system
- OAuth2 access token (client_credentials)
- Pay-page order creation
- Webhook signature verification
- Subscription lifecycle + coupon support
- Plan expiry auto-downgrade
"""

import hashlib
import hmac
import json
import logging
import os
import time
import uuid

import requests
from flask import Blueprint, request
from config.db import get_db
from config.admin import create_notification
from utils import json_resp, json_error, require_auth, require_admin

logger = logging.getLogger(__name__)
payments_bp = Blueprint("payments", __name__)

# ── Plan config ───────────────────────────────────────────────────────────────
PLANS = {
    "basic":    {"amount": 5000,  "label": "Basic Plan",    "role": "basic",    "days": 30},
    "pro":      {"amount": 59900,  "label": "Pro Plan",      "role": "pro",      "days": 30},
    "advanced": {"amount": 99900,  "label": "Advanced Plan", "role": "advanced", "days": 30},
}

# ── PhonePe v2 config — read lazily so load_dotenv() always runs first ───────
def _cfg():
    return {
        "env":     os.getenv("PHONEPE_ENV", "PRODUCTION").upper(),
        "id":      os.getenv("PHONEPE_CLIENT_ID", "").strip(),
        "secret":  os.getenv("PHONEPE_CLIENT_SECRET", "").strip(),
        "version": int(os.getenv("PHONEPE_CLIENT_VERSION", "1").strip()),
        "redirect": os.getenv("PHONEPE_REDIRECT_URL", "http://localhost:5173/payment/success"),
        "callback": os.getenv("PHONEPE_CALLBACK_URL", ""),
    }

def _pg_base():
    return (
        "https://api.phonepe.com/apis/pg"
        if _cfg()["env"] == "PRODUCTION"
        else "https://api-preprod.phonepe.com/apis/pg"
    )

def _auth_url():
    return (
        "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
        if _cfg()["env"] == "PRODUCTION"
        else "https://api-preprod.phonepe.com/apis/identity-manager/v1/oauth/token"
    )

def _bridge_url():
    return os.getenv("PHONEPE_BRIDGE_URL", "").strip()

def _bridge_secret():
    return os.getenv("PHONEPE_BRIDGE_SECRET", "").strip()

def _bridge_headers():
    return {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }

def _bridge_initiate(payload: dict) -> requests.Response:
    return requests.post(
        _bridge_url(),
        json={
            "action":  "initiate",
            "secret":  _bridge_secret(),
            "payload": payload,
        },
        headers=_bridge_headers(),
        timeout=15,
    )

def _bridge_status(order_id: str) -> dict | None:
    try:
        cfg = _cfg()
        resp = requests.post(
            _bridge_url(),
            json={
                "action":   "status",
                "secret":   _bridge_secret(),
                "order_id": order_id,
                "payload":  {"merchantId": cfg["id"]} # Required by current PHP bridge for getToken
            },
            headers=_bridge_headers(),
            timeout=10,
        )
        if resp.status_code == 200:
            return resp.json()
    except Exception:
        logger.exception("Bridge status call failed order=%s", order_id)
    return None


def _verify_webhook_signature(raw_body: bytes, auth_header: str) -> bool:
    try:
        scheme, token = auth_header.split(" ", 1)
        if scheme.upper() != "O":
            return False
        import base64
        secret = _cfg()["secret"]
        expected = base64.b64encode(
            hashlib.sha256((raw_body.decode() + secret).encode()).digest()
        ).decode()
        return hmac.compare_digest(token.strip(), expected)
    except Exception:
        return False


def _activate_plan(db, user_id: int, plan: str, payment_id: int):
    """Activate plan, create subscription record, update user role — all in one transaction."""
    plan_info = PLANS[plan]
    role = plan_info["role"]
    days = plan_info["days"]

    db.autocommit(False)
    try:
        with db.cursor() as cur:
            cur.execute(
                "UPDATE subscriptions SET status='cancelled', cancelled_at=NOW() "
                "WHERE user_id=%s AND status='active'",
                (user_id,)
            )
            cur.execute(
                "INSERT INTO subscriptions (user_id, plan, status, payment_id, start_date, end_date) "
                "VALUES (%s, %s, 'active', %s, NOW(), DATE_ADD(NOW(), INTERVAL %s DAY))",
                (user_id, plan, payment_id, days)
            )
            sub_id = cur.lastrowid
            cur.execute("UPDATE payments SET subscription_id=%s WHERE id=%s", (sub_id, payment_id))
            cur.execute(
                "UPDATE users SET role=%s, plan_status='active', "
                "plan_expires_at=DATE_ADD(NOW(), INTERVAL %s DAY) WHERE id=%s",
                (role, days, user_id)
            )
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.autocommit(True)

    try:
        create_notification(
            user_id, "payment_success", "Payment Successful!",
            f"Your {plan.capitalize()} plan is now active for {days} days.",
        )
    except Exception:
        logger.exception("create_notification failed user_id=%s", user_id)

    logger.info("Plan activated user_id=%s plan=%s sub_id=%s", user_id, plan, sub_id)


# ── POST /api/pay/initiate ────────────────────────────────────────────────────
@payments_bp.route("/initiate", methods=["POST"])
@require_auth
def initiate_payment(identity):
    user_id     = int(identity["user_id"])
    body        = request.get_json(silent=True) or {}
    plan        = body.get("plan", "").lower()
    coupon_code = body.get("coupon", "").strip().upper()

    if plan not in PLANS:
        return json_error(400, "Invalid plan.")

    plan_info = PLANS[plan]
    amount    = plan_info["amount"]
    discount  = 0
    coupon_id = None

    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute("SELECT email, name FROM users WHERE id=%s", (user_id,))
            user = cur.fetchone()
        if not user:
            return json_error(404, "User not found.")

        # Validate coupon
        if coupon_code:
            with db.cursor() as cur:
                cur.execute(
                    "SELECT * FROM coupons WHERE code=%s AND is_active=1 "
                    "AND (valid_until IS NULL OR valid_until > NOW()) "
                    "AND (max_uses IS NULL OR used_count < max_uses) "
                    "AND (applicable_plan='all' OR applicable_plan=%s)",
                    (coupon_code, plan)
                )
                coupon = cur.fetchone()
            if not coupon:
                return json_error(400, "Invalid or expired coupon code.")
            if coupon["discount_type"] == "percent":
                discount = int(amount * coupon["discount_value"] / 100)
            else:
                discount = min(coupon["discount_value"] * 100, amount)
            coupon_id = coupon["id"]
            amount = max(amount - discount, 0)

        order_id = f"SC-{user_id}-{uuid.uuid4().hex[:12].upper()}"

        # Save pending payment record
        with db.cursor() as cur:
            cur.execute(
                "INSERT INTO payments (user_id, plan, amount, phonepe_order_id, status, coupon_id, discount_amount) "
                "VALUES (%s,%s,%s,%s,'pending',%s,%s)",
                (user_id, plan, amount, order_id, coupon_id, discount),
            )
            payment_id = cur.lastrowid

        # 100% discount — activate immediately without gateway
        if amount == 0:
            with db.cursor() as cur:
                cur.execute("UPDATE payments SET status='success' WHERE id=%s", (payment_id,))
            if coupon_id:
                with db.cursor() as cur:
                    cur.execute("UPDATE coupons SET used_count=used_count+1 WHERE id=%s", (coupon_id,))
            _activate_plan(db, user_id, plan, payment_id)
            return json_resp(200, {"free": True, "order_id": order_id, "plan": plan})

    except Exception:
        logger.exception("initiate_payment DB error user_id=%s", user_id)
        return json_error(500, "Failed to create payment record.")
    finally:
        db.close()

    # ── PhonePe via bridge (kairatechnologies.in) ────────────────────────────
    cfg = _cfg()
    if not _bridge_url():
        logger.error("PHONEPE_BRIDGE_URL not configured")
        return json_error(500, "Payment gateway not configured.")

    payload = {
        "merchantId":      cfg['id'],
        "merchantOrderId": order_id,
        "amount":          amount,
        "currency":        "INR",
        "env":             cfg['env'],
        "redirectUrl":     f"{cfg['redirect']}?order_id={order_id}",
        "callbackUrl":     cfg['callback'],
        "paymentFlow":     {"type": "PG_CHECKOUT"},
    }

    try:
        resp = _bridge_initiate(payload)
        logger.info(f"DEBUG: Bridge raw response: status={resp.status_code} text={resp.text}")
        data = resp.json()
        logger.info("Bridge initiate response status=%s body=%s", resp.status_code, data)

        redirect_url = (
            data.get("redirectUrl")
            or data.get("data", {}).get("redirectUrl")
            or data.get("data", {}).get("instrumentResponse", {}).get("redirectInfo", {}).get("url")
        )
        if resp.status_code in (200, 201) and redirect_url:
            return json_resp(200, {"redirect_url": redirect_url, "order_id": order_id})

        logger.error("Bridge initiate failed: %s", data)
        return json_error(502, data.get("message", "Payment gateway error."))

    except Exception:
        logger.exception("Bridge API call failed")
        return json_error(502, "Could not reach payment gateway.")


# ── POST /api/pay/callback  (PhonePe webhook) ─────────────────────────────────
@payments_bp.route("/callback", methods=["POST"])
def payment_callback():
    raw_body    = request.get_data()
    auth_header = request.headers.get("Authorization", "")
    cfg = _cfg()
    # Verify webhook signature
    if cfg["secret"] and not _verify_webhook_signature(raw_body, auth_header):
        logger.warning("PhonePe callback signature MISMATCH")
        return json_error(403, "Signature mismatch.")

    try:
        body = json.loads(raw_body)
    except Exception:
        return json_error(400, "Invalid JSON payload.")

    # PhonePe v2 webhook payload
    event_type  = body.get("type", "")
    payload     = body.get("payload", {})
    order_id    = payload.get("merchantOrderId", "")
    phonepe_txn = payload.get("transactionId", "") or payload.get("orderId", "")
    state       = payload.get("state", "")          # COMPLETED | FAILED
    error_code  = payload.get("errorCode", "")

    if not order_id:
        return json_error(400, "Missing merchantOrderId.")

    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute("SELECT * FROM payments WHERE phonepe_order_id=%s", (order_id,))
            payment = cur.fetchone()

        if not payment:
            logger.warning("Callback for unknown order_id=%s", order_id)
            return json_error(404, "Payment record not found.")

        # Idempotency
        if payment["status"] == "success":
            return json_resp(200, {"message": "Already processed."})

        if state == "COMPLETED" or event_type == "checkout.order.completed":
            with db.cursor() as cur:
                cur.execute(
                    "UPDATE payments SET status='success', phonepe_txn_id=%s WHERE phonepe_order_id=%s",
                    (phonepe_txn, order_id),
                )
            if payment.get("coupon_id"):
                with db.cursor() as cur:
                    cur.execute("UPDATE coupons SET used_count=used_count+1 WHERE id=%s", (payment["coupon_id"],))
            _activate_plan(db, payment["user_id"], payment["plan"], payment["id"])
            logger.info("Webhook success order=%s user=%s plan=%s", order_id, payment["user_id"], payment["plan"])

        else:
            with db.cursor() as cur:
                cur.execute(
                    "UPDATE payments SET status='failed', phonepe_txn_id=%s WHERE phonepe_order_id=%s",
                    (phonepe_txn, order_id),
                )
            logger.warning("Webhook payment failed order=%s state=%s error=%s", order_id, state, error_code)

        return json_resp(200, {"message": "Callback processed."})

    except Exception:
        logger.exception("payment_callback failed order=%s", order_id)
        return json_error(500, "Callback processing failed.")
    finally:
        db.close()


# ── GET /api/pay/status?order_id=xxx ─────────────────────────────────────────
@payments_bp.route("/status", methods=["GET"])
@require_auth
def payment_status(identity):
    user_id  = int(identity["user_id"])
    order_id = request.args.get("order_id", "").strip()
    if not order_id:
        return json_error(400, "order_id required.")

    # Also poll PhonePe via bridge for latest status
    live_state = _bridge_status(order_id)

    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute(
                "SELECT id, user_id, status, plan, amount, discount_amount, created_at FROM payments "
                "WHERE phonepe_order_id=%s AND user_id=%s",
                (order_id, user_id),
            )
            payment = cur.fetchone()
        if not payment:
            return json_error(404, "Payment not found.")

        # If PhonePe says COMPLETED but our DB still shows pending — activate now
        if live_state == "COMPLETED" and payment["status"] == "pending":
            with db.cursor() as cur:
                cur.execute("UPDATE payments SET status='success' WHERE phonepe_order_id=%s AND status='pending'", (order_id,))
            if cur.rowcount > 0:
                _activate_plan(db, payment["user_id"], payment["plan"], payment["id"])
                payment["status"] = "success"

        return json_resp(200, {"payment": payment})
    except Exception:
        logger.exception("payment_status failed order=%s", order_id)
        return json_error(500, "Failed to fetch payment status.")
    finally:
        db.close()


# ── GET /api/pay/history ──────────────────────────────────────────────────────
@payments_bp.route("/history", methods=["GET"])
@require_auth
def payment_history(identity):
    user_id = int(identity["user_id"])
    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute(
                "SELECT p.plan, p.amount, p.discount_amount, p.status, p.phonepe_order_id, "
                "p.created_at, s.end_date, s.status as sub_status "
                "FROM payments p LEFT JOIN subscriptions s ON s.payment_id=p.id "
                "WHERE p.user_id=%s ORDER BY p.created_at DESC LIMIT 20",
                (user_id,),
            )
            payments = cur.fetchall()
        return json_resp(200, {"payments": payments})
    except Exception:
        logger.exception("payment_history failed user_id=%s", user_id)
        return json_error(500, "Failed to fetch payment history.")
    finally:
        db.close()


# ── GET /api/pay/subscription ─────────────────────────────────────────────────
@payments_bp.route("/subscription", methods=["GET"])
@require_auth
def get_subscription(identity):
    user_id = int(identity["user_id"])
    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute(
                "SELECT s.*, u.role, u.plan_expires_at FROM subscriptions s "
                "JOIN users u ON u.id=s.user_id "
                "WHERE s.user_id=%s AND s.status='active' ORDER BY s.created_at DESC LIMIT 1",
                (user_id,),
            )
            sub = cur.fetchone()
        return json_resp(200, {"subscription": sub})
    except Exception:
        logger.exception("get_subscription failed user_id=%s", user_id)
        return json_error(500, "Failed to fetch subscription.")
    finally:
        db.close()


# ── POST /api/pay/validate-coupon ─────────────────────────────────────────────
@payments_bp.route("/validate-coupon", methods=["POST"])
@require_auth
def validate_coupon(identity):
    body = request.get_json(silent=True) or {}
    code = body.get("code", "").strip().upper()
    plan = body.get("plan", "").lower()
    if not code or not plan:
        return json_error(400, "code and plan required.")
    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute(
                "SELECT * FROM coupons WHERE code=%s AND is_active=1 "
                "AND (valid_until IS NULL OR valid_until > NOW()) "
                "AND (max_uses IS NULL OR used_count < max_uses) "
                "AND (applicable_plan='all' OR applicable_plan=%s)",
                (code, plan)
            )
            coupon = cur.fetchone()
        if not coupon:
            return json_error(400, "Invalid or expired coupon.")
        amount = PLANS.get(plan, {}).get("amount", 0)
        if coupon["discount_type"] == "percent":
            discount = int(amount * coupon["discount_value"] / 100)
        else:
            discount = min(coupon["discount_value"] * 100, amount)
        return json_resp(200, {
            "valid":           True,
            "discount_type":   coupon["discount_type"],
            "discount_value":  coupon["discount_value"],
            "discount_amount": discount,
            "final_amount":    max(amount - discount, 0),
        })
    except Exception:
        logger.exception("validate_coupon failed code=%s", code)
        return json_error(500, "Failed to validate coupon.")
    finally:
        db.close()


# ── POST /api/pay/expire-plans  (cron job) ────────────────────────────────────
@payments_bp.route("/expire-plans", methods=["POST"])
def expire_plans():
    secret = request.headers.get("X-Cron-Secret", "")
    if secret != os.getenv("CRON_SECRET", ""):
        return json_error(403, "Unauthorized.")
    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute("SELECT user_id FROM subscriptions WHERE status='active' AND end_date < NOW()")
            expired = cur.fetchall()
        count = 0
        for row in expired:
            uid = row["user_id"]
            with db.cursor() as cur:
                cur.execute(
                    "UPDATE subscriptions SET status='expired' WHERE user_id=%s AND status='active' AND end_date < NOW()",
                    (uid,)
                )
                cur.execute(
                    "UPDATE users SET role='basic', plan_status=NULL, plan_expires_at=NULL WHERE id=%s",
                    (uid,)
                )
            try:
                create_notification(uid, "plan_expired", "Plan Expired",
                    "Your subscription has expired. Upgrade to continue using premium features.")
            except Exception:
                logger.exception("create_notification failed uid=%s", uid)
            count += 1
        logger.info("expire_plans: downgraded %d users", count)
        return json_resp(200, {"expired": count})
    except Exception:
        logger.exception("expire_plans failed")
        return json_error(500, "Failed to expire plans.")
    finally:
        db.close()


# ── Admin: GET /api/pay/admin/transactions ────────────────────────────────────
@payments_bp.route("/admin/transactions", methods=["GET"])
@require_admin
def admin_transactions(identity):
    page   = max(1, int(request.args.get("page", 1)))
    limit  = 20
    offset = (page - 1) * limit
    status = request.args.get("status", "")
    plan   = request.args.get("plan", "")

    conditions = ["1=1"]
    params = []
    if status:
        conditions.append("p.status=%s"); params.append(status)
    if plan:
        conditions.append("p.plan=%s"); params.append(plan)
    where = " AND ".join(conditions)

    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute(
                f"SELECT p.*, u.name, u.email FROM payments p "
                f"JOIN users u ON u.id=p.user_id WHERE {where} "
                f"ORDER BY p.created_at DESC LIMIT %s OFFSET %s",
                params + [limit, offset]
            )
            txns = cur.fetchall()
            cur.execute(f"SELECT COUNT(*) as total FROM payments p WHERE {where}", params)
            total = cur.fetchone()["total"]
        return json_resp(200, {"transactions": txns, "total": total, "page": page})
    except Exception:
        logger.exception("admin_transactions failed")
        return json_error(500, "Failed to fetch transactions.")
    finally:
        db.close()


# ── Admin: PUT /api/pay/admin/override ───────────────────────────────────────
@payments_bp.route("/admin/override", methods=["PUT"])
@require_admin
def admin_override(identity):
    admin_id = int(identity["user_id"])
    body     = request.get_json(silent=True) or {}
    user_id  = body.get("user_id")
    action   = body.get("action")
    plan     = body.get("plan", "basic")
    days     = int(body.get("days", 30))
    note     = body.get("note", "")

    if not user_id or not action:
        return json_error(400, "user_id and action required.")

    db = get_db()
    try:
        if action == "upgrade":
            with db.cursor() as cur:
                cur.execute(
                    "UPDATE subscriptions SET status='cancelled' WHERE user_id=%s AND status='active'",
                    (user_id,)
                )
                cur.execute(
                    "INSERT INTO subscriptions (user_id, plan, status, start_date, end_date, admin_note) "
                    "VALUES (%s,%s,'active',NOW(),DATE_ADD(NOW(),INTERVAL %s DAY),%s)",
                    (user_id, plan, days, f"Admin override by {admin_id}: {note}")
                )
            role = PLANS.get(plan, {}).get("role", plan)
            with db.cursor() as cur:
                cur.execute(
                    "UPDATE users SET role=%s, plan_status='active', "
                    "plan_expires_at=DATE_ADD(NOW(),INTERVAL %s DAY) WHERE id=%s",
                    (role, days, user_id)
                )
        elif action in ("downgrade", "cancel"):
            with db.cursor() as cur:
                cur.execute(
                    "UPDATE subscriptions SET status='cancelled', cancelled_at=NOW() "
                    "WHERE user_id=%s AND status='active'", (user_id,)
                )
                cur.execute(
                    "UPDATE users SET role='basic', plan_status=NULL, plan_expires_at=NULL WHERE id=%s",
                    (user_id,)
                )
        elif action == "extend":
            with db.cursor() as cur:
                cur.execute(
                    "UPDATE subscriptions SET end_date=DATE_ADD(end_date, INTERVAL %s DAY) "
                    "WHERE user_id=%s AND status='active'", (days, user_id)
                )
                cur.execute(
                    "UPDATE users SET plan_expires_at=DATE_ADD(plan_expires_at, INTERVAL %s DAY) "
                    "WHERE id=%s", (days, user_id)
                )
        else:
            return json_error(400, "Invalid action.")

        try:
            create_notification(user_id, "admin_plan_change", "Plan Updated",
                f"Your plan has been updated by admin. {note}")
        except Exception:
            logger.exception("create_notification failed user_id=%s", user_id)

        logger.info("admin_override admin=%s user=%s action=%s plan=%s", admin_id, user_id, action, plan)
        return json_resp(200, {"message": "Plan updated successfully."})
    except Exception:
        logger.exception("admin_override failed user=%s", user_id)
        return json_error(500, "Failed to update plan.")
    finally:
        db.close()

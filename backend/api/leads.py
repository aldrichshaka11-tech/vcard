"""
api/leads.py

FIX: CREATE TABLE has been removed from this endpoint.
     Run the migration in database.sql / add-role-columns.sql before deploying.
     DDL in hot paths causes a table-level lock on every single request.
"""

import logging
import re

from flask import Blueprint, request
from config.db import get_db
from config.admin import can_access_feature
from utils import json_resp, json_error, require_auth

logger = logging.getLogger(__name__)
leads_bp = Blueprint("leads", __name__)


@leads_bp.route("", methods=["POST"])
def capture_lead():
    body = request.get_json(silent=True) or {}
    slug   = body.get("slug",  "").strip()
    name   = str(body.get("name",  "")).strip()[:120]
    email  = str(body.get("email", "")).strip()[:190]
    phone  = str(body.get("phone", "")).strip()[:30]
    note   = body.get("note", "").strip()

    if not slug:
        return json_error(400, "Slug is required.")
    if not name:
        return json_error(422, "Name is required.")
    if not email and not phone:
        return json_error(422, "Email or phone is required.")
    if email and not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return json_error(422, "Invalid email format.")

    db = get_db()
    try:
        with db.cursor() as cur:
            if slug.isdigit():
                cur.execute(
                    "SELECT id FROM cards WHERE id = %s AND is_active = 1 LIMIT 1",
                    (int(slug),),
                )
            else:
                cur.execute(
                    """SELECT c.id FROM cards c
                       JOIN users u ON u.id = c.user_id
                       WHERE u.slug = %s AND c.is_active = 1
                       LIMIT 1""",
                    (slug,),
                )
            card = cur.fetchone()
            if not card:
                return json_error(404, "Card not found.")

            cur.execute("SELECT role FROM users WHERE id=(SELECT user_id FROM cards WHERE id=%s)", (card["id"],))
            owner = cur.fetchone()
            if owner and not can_access_feature(owner["role"], "lead_capture"):
                return json_error(403, "Lead capture is not available on this card.")

            cur.execute(
                """INSERT INTO card_leads
                       (card_id, lead_name, lead_email, lead_phone, lead_note, source)
                   VALUES (%s, %s, %s, %s, %s, 'public_card')""",
                (card["id"], name, email or None, phone or None, note or None),
            )
        return json_resp(201, {"message": "Lead captured successfully."})
    except Exception:
        logger.exception("capture_lead failed slug=%s", slug)
        return json_error(500, "Failed to capture lead.")
    finally:
        db.close()


# GET /api/leads?card_id=<id> — card owner only
@leads_bp.route("", methods=["GET"])
@require_auth
def get_leads(identity):
    user_id = int(identity["user_id"])
    card_id = int(request.args.get("card_id", 0))
    if not card_id:
        return json_error(400, "card_id is required.")

    db = get_db()
    try:
        # Verify ownership
        with db.cursor() as cur:
            cur.execute("SELECT id FROM cards WHERE id=%s AND user_id=%s", (card_id, user_id))
            if not cur.fetchone():
                return json_error(403, "Card not found or access denied.")

        with db.cursor() as cur:
            cur.execute(
                """SELECT id, lead_name, lead_email, lead_phone, lead_note,
                          source, created_at
                   FROM card_leads
                   WHERE card_id = %s
                   ORDER BY created_at DESC
                   LIMIT 100""",
                (card_id,),
            )
            leads = cur.fetchall()

        return json_resp(200, {"leads": leads})
    except Exception:
        logger.exception("get_leads failed card_id=%s", card_id)
        return json_error(500, "Failed to fetch leads.")
    finally:
        db.close()


# DELETE /api/leads/<lead_id> — card owner only
@leads_bp.route("/<int:lead_id>", methods=["DELETE"])
@require_auth
def delete_lead(identity, lead_id):
    user_id = int(identity["user_id"])
    db = get_db()
    try:
        with db.cursor() as cur:
            # Verify the lead belongs to a card owned by this user
            cur.execute(
                """SELECT cl.id FROM card_leads cl
                   JOIN cards c ON c.id = cl.card_id
                   WHERE cl.id = %s AND c.user_id = %s""",
                (lead_id, user_id),
            )
            if not cur.fetchone():
                return json_error(403, "Lead not found or access denied.")
            cur.execute("DELETE FROM card_leads WHERE id = %s", (lead_id,))
        return json_resp(200, {"message": "Lead deleted."})
    except Exception:
        logger.exception("delete_lead failed lead_id=%s", lead_id)
        return json_error(500, "Failed to delete lead.")
    finally:
        db.close()


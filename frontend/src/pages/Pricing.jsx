import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Zap, Crown, Rocket, Loader, Tag, Clock, CreditCard } from 'lucide-react'
import { useAuth } from '../api/useAuth'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const PLANS = [
  {
    id: 'basic', name: 'Basic', price: 299, label: '/month',
    icon: <Zap size={22} />, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200',
    features: [
      { text: '1 Digital Card', ok: true },
      { text: 'Profile Photo', ok: true },
      { text: '5 Social Links', ok: true },
      { text: '7-day Analytics', ok: true },
      { text: 'QR Code Share', ok: true },
      { text: 'Cover & Logo Photo', ok: false },
      { text: 'Custom Colors', ok: false },
      { text: 'Lead Capture', ok: false },
      { text: 'Virtual Background', ok: false },
      { text: 'CSV Export', ok: false },
    ],
  },
  {
    id: 'pro', name: 'Pro', price: 599, label: '/month',
    icon: <Crown size={22} />, color: 'text-indigo-600', bg: 'bg-indigo-50',
    border: 'border-indigo-400', popular: true,
    features: [
      { text: '3 Digital Cards', ok: true },
      { text: 'Profile Photo', ok: true },
      { text: 'Unlimited Links', ok: true },
      { text: '30-day Analytics', ok: true },
      { text: 'QR Code Share', ok: true },
      { text: 'Cover & Logo Photo', ok: true },
      { text: 'Custom Colors', ok: true },
      { text: 'Lead Capture', ok: true },
      { text: 'Virtual Background', ok: false },
      { text: 'CSV Export', ok: false },
    ],
  },
  {
    id: 'advanced', name: 'Advanced', price: 999, label: '/month',
    icon: <Rocket size={22} />, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-400',
    features: [
      { text: 'Unlimited Cards', ok: true },
      { text: 'Profile Photo', ok: true },
      { text: 'Unlimited Links', ok: true },
      { text: 'Full Analytics History', ok: true },
      { text: 'QR Code Share', ok: true },
      { text: 'Cover & Logo Photo', ok: true },
      { text: 'Custom Colors', ok: true },
      { text: 'Lead Capture', ok: true },
      { text: 'Virtual Background', ok: true },
      { text: 'CSV Export', ok: true },
    ],
  },
]

export default function Pricing() {
  const navigate = useNavigate()
  const { user, isAdmin, isAdvanced, isPro, isBasic, loading: authLoading } = useAuth()
  const [paying, setPaying] = useState(null)
  const [coupon, setCoupon] = useState('')
  const [couponResult, setCouponResult] = useState(null) // { discount_amount, final_amount, discount_type, discount_value }
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponPlan, setCouponPlan] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  const currentPlan = user?.role || 'basic'

  useEffect(() => {
    if (!user) return
    api.get('/pay/subscription').then(r => setSubscription(r.data.subscription)).catch(() => {})
    api.get('/pay/history').then(r => setHistory(r.data.payments || [])).catch(() => {})
  }, [user])

  const validateCoupon = async (planId) => {
    if (!coupon.trim()) return
    setCouponLoading(true)
    setCouponPlan(planId)
    try {
      const res = await api.post('/pay/validate-coupon', { code: coupon.trim(), plan: planId })
      setCouponResult(res.data)
    } catch (err) {
      setCouponResult({ error: err.response?.data?.error || 'Invalid coupon' })
    } finally {
      setCouponLoading(false)
    }
  }

  const handlePay = async (planId) => {
    if (!user) { navigate('/login'); return }
    setPaying(planId)
    try {
      const body = { plan: planId }
      if (coupon.trim() && couponPlan === planId && couponResult?.valid) {
        body.coupon = coupon.trim()
      }
      const res = await api.post('/pay/initiate', body)
      if (res.data.free) {
        // 100% coupon discount — already activated
        await new Promise(r => setTimeout(r, 500))
        navigate('/payment/success?order_id=' + res.data.order_id)
      } else {
        window.location.href = res.data.redirect_url
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Payment initiation failed. Please try again.')
    } finally {
      setPaying(null)
    }
  }

  const PLAN_ORDER = { basic: 0, pro: 1, advanced: 2 }

  const getButtonLabel = (plan) => {
    if (authLoading) return 'Loading...'
    if (!user) return 'Get Started'
    if (isAdmin()) return 'Admin — Full Access'
    if (plan.id === currentPlan && user?.plan_status === 'active') return 'Renew Plan'
    if (plan.id === currentPlan) return 'Activate Plan'
    if (PLAN_ORDER[plan.id] < PLAN_ORDER[currentPlan]) return `Switch to ${plan.name}`
    return `Upgrade to ${plan.name}`
  }

  const isCurrentPlan = (plan) => false // always allow payment

  const getDisplayPrice = (plan) => {
    if (couponResult?.valid && couponPlan === plan.id && !couponResult.error) {
      return Math.round(couponResult.final_amount / 100)
    }
    return plan.price
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full mb-4">
              <Crown className="text-indigo-500" size={16} />
              <span className="text-sm font-semibold text-indigo-700">Simple Pricing</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose your plan</h1>
            <p className="text-gray-500 text-lg">Start free. Upgrade when you need more.</p>
          </div>

          {/* Current subscription status */}
          {subscription && (
            <div className="max-w-md mx-auto mb-8 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-800 capitalize">{subscription.plan} Plan Active</p>
                <p className="text-xs text-green-600">
                  Expires: {new Date(subscription.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <Clock size={16} className="text-green-500 flex-shrink-0" />
            </div>
          )}

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {PLANS.map((plan) => (
              <div key={plan.id}
                className={`relative bg-white rounded-3xl border-2 ${plan.popular ? plan.border + ' shadow-xl shadow-indigo-100' : 'border-slate-200 shadow-sm'} p-8 flex flex-col transition-all hover:shadow-lg hover:-translate-y-1`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div className={`w-12 h-12 ${plan.bg} rounded-2xl flex items-center justify-center ${plan.color} mb-4`}>
                  {plan.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>

                {/* Price display */}
                <div className="flex items-end gap-1 mb-1">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold text-gray-900">Free</span>
                  ) : (
                    <>
                      <span className="text-sm text-gray-400 mb-1">₹</span>
                      <span className={`text-4xl font-bold ${couponResult?.valid && couponPlan === plan.id ? 'text-green-600' : 'text-gray-900'}`}>
                        {getDisplayPrice(plan)}
                      </span>
                      <span className="text-sm text-gray-400 mb-1">{plan.label}</span>
                    </>
                  )}
                </div>
                {couponResult?.valid && couponPlan === plan.id && (
                  <p className="text-xs text-green-600 font-semibold mb-3 line-through text-gray-400">
                    ₹{plan.price} → <span className="no-underline text-green-600">₹{getDisplayPrice(plan)}</span>
                  </p>
                )}

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      {f.ok
                        ? <Check size={15} className="text-green-500 flex-shrink-0" />
                        : <X size={15} className="text-gray-300 flex-shrink-0" />}
                      <span className={`text-sm ${f.ok ? 'text-gray-700' : 'text-gray-400'}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Coupon input for paid plans */}
                {plan.price > 0 && !isCurrentPlan(plan) && !isAdmin() && (
                  <div className="mb-3">
                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <Tag size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Coupon code"
                          value={couponPlan === plan.id ? coupon : ''}
                          onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponPlan(plan.id); setCouponResult(null) }}
                          className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 font-mono uppercase"
                        />
                      </div>
                      <button
                        onClick={() => validateCoupon(plan.id)}
                        disabled={couponLoading && couponPlan === plan.id}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors border border-gray-200">
                        {couponLoading && couponPlan === plan.id ? <Loader size={11} className="animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                    {couponResult && couponPlan === plan.id && (
                      <p className={`text-xs mt-1 font-medium ${couponResult.error ? 'text-red-500' : 'text-green-600'}`}>
                        {couponResult.error || `✓ Saved ₹${Math.round(couponResult.discount_amount / 100)}!`}
                      </p>
                    )}
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => handlePay(plan.id)}
                  disabled={paying === plan.id || isAdmin() || authLoading}
                  className={`w-full py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    isAdmin()
                      ? 'bg-gray-100 text-gray-400 cursor-default'
                      : plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                        : plan.id === 'basic'
                          ? 'bg-gray-800 hover:bg-gray-900 text-white hover:-translate-y-0.5'
                          : 'bg-violet-600 hover:bg-violet-700 text-white hover:-translate-y-0.5'
                  }`}>
                  {paying === plan.id
                    ? <><Loader size={15} className="animate-spin" /> Redirecting...</>
                    : getButtonLabel(plan)}
                </button>
              </div>
            ))}
          </div>

          {/* Payment history */}
          {history.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <button onClick={() => setShowHistory(v => !v)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-3">
                <CreditCard size={15} />
                {showHistory ? 'Hide' : 'View'} Payment History ({history.length})
              </button>
              {showHistory && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Plan</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {history.map((p, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold capitalize text-gray-800">{p.plan}</td>
                          <td className="px-4 py-3 text-gray-600">
                            ₹{Math.round(p.amount / 100)}
                            {p.discount_amount > 0 && <span className="text-xs text-green-600 ml-1">(-₹{Math.round(p.discount_amount / 100)})</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              p.status === 'success' ? 'bg-green-100 text-green-700' :
                              p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(p.created_at).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-6">
            Payments powered by PhonePe · Secure · Auto-renews monthly · Cancel anytime
          </p>
        </div>
      </div>
    </>
  )
}

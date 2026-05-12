import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, CreditCard, TrendingUp, Clock, ArrowRight, BarChart2, Shield, Settings, Eye, FileText, Check, X, DollarSign } from 'lucide-react'
import axios from '../api/axios'
import { useAuth } from '../api/useAuth'
import Navbar from '../components/Navbar'

const FEATURE_LABELS = {
  max_cards:           'Max Cards',
  max_social_links:    'Max Social Links',
  max_theme_colors:    'Max Theme Colors',
  cover_photo:         'Cover Photo',
  company_logo:        'Company Logo',
  virtual_background:  'Virtual Background',
  custom_color_picker: 'Custom Color Picker',
  advanced_analytics:  'Advanced Analytics',
  custom_fields:       'Custom Fields',
  lead_capture:        'Lead Capture',
  custom_colors:       'Custom Colors',
  theme_colors:        'Theme Colors',
  social_links:        'Social Links',
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [limits, setLimits] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [savingLimits, setSavingLimits] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) return
    if (!isAdmin()) { navigate('/dashboard'); return }
    loadAll()
  }, [authLoading, user])

  const loadAll = async () => {
    try {
      const [s, a, l] = await Promise.all([
        axios.get('/admin'),
        axios.get('/admin/analytics'),
        axios.get('/admin/feature-limits'),
      ])
      setStats(s.data.stats)
      setAnalytics(a.data)
      setLimits(l.data.limits || [])
      try {
        const t = await axios.get('/pay/admin/transactions')
        setTransactions(t.data.transactions || [])
      } catch {}
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const updateLimit = (id, field, value) => {
    setLimits(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  const saveLimits = async () => {
    setSavingLimits(true)
    try {
      await axios.put('/admin/feature-limits', { limits })
      showToast('Feature limits saved successfully')
    } catch {
      showToast('Failed to save limits')
    } finally {
      setSavingLimits(false)
    }
  }

  if (authLoading || loading) return (
    <><Navbar /><div className="flex items-center justify-center min-h-[70vh]"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div></>
  )

  const statCards = [
    { label: 'Total Users', value: stats?.total_users ?? 0, icon: <Users size={16} />, color: 'text-indigo-600', bg: 'bg-indigo-50', onClick: () => navigate('/admin/users') },
    { label: 'Free Users', value: stats?.free_users ?? 0, icon: <Users size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Premium Users', value: stats?.premium_users ?? 0, icon: <CreditCard size={16} />, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Pending Requests', value: stats?.pending_requests ?? 0, icon: <Clock size={16} />, color: 'text-orange-600', bg: 'bg-orange-50', onClick: () => navigate('/admin/requests') },
    { label: 'Total Cards', value: analytics?.total_cards ?? 0, icon: <FileText size={16} />, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Total Views', value: analytics?.total_views ?? 0, icon: <Eye size={16} />, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'New Users (7d)', value: analytics?.new_users_7d ?? 0, icon: <TrendingUp size={16} />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Views (7d)', value: analytics?.views_7d ?? 0, icon: <BarChart2 size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  const freeLimits = limits.filter(l => l.plan_type === 'free')
  const premiumLimits = limits.filter(l => l.plan_type === 'premium')

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 min-h-screen bg-white">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
                <Shield size={14} className="text-violet-600" />
              </div>
              <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">Admin Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <Users size={15} /> Users
            </button>
            <button onClick={() => navigate('/admin/requests')} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <Clock size={15} /> Requests
              {(stats?.pending_requests ?? 0) > 0 && (
                <span className="bg-white/25 text-white text-xs px-1.5 py-0.5 rounded-full">{stats.pending_requests}</span>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart2 size={14} /> },
            { id: 'limits', label: 'Feature Limits', icon: <Settings size={14} /> },
            { id: 'transactions', label: 'Transactions', icon: <DollarSign size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100' : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {statCards.map((s, i) => (
                <div
                  key={i}
                  onClick={s.onClick}
                  className={`card-stat rounded-2xl p-4 group ${
                    s.onClick
                      ? 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30'
                      : ''
                  }`}
                >
                  <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center ${s.color} mb-3 group-hover:scale-110 transition-transform`}>{s.icon}</div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  {s.onClick && <p className="text-xs text-indigo-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to view →</p>}
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={() => navigate('/admin/users')} className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <Users size={16} className="text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">User Management</p>
                    <p className="text-xs text-gray-400">Set roles, card limits per user</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
              </button>
              <button onClick={() => navigate('/admin/requests')} className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-violet-300 hover:bg-violet-50/40 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                    <CreditCard size={16} className="text-violet-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">Premium Requests</p>
                    <p className="text-xs text-gray-400">{stats?.pending_requests ?? 0} pending approval</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-violet-500 transition-colors" />
              </button>
              <button onClick={() => setActiveTab('limits')} className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-teal-300 hover:bg-teal-50/40 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                    <Settings size={16} className="text-teal-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">Feature Limits</p>
                    <p className="text-xs text-gray-400">Control free & premium plan features</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-teal-500 transition-colors" />
              </button>
            </div>
          </>
        )}

        {activeTab === 'limits' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Feature Limits</h2>
                <p className="text-sm text-gray-500 mt-0.5">Control what free and premium users can access</p>
              </div>
              <button
                onClick={saveLimits}
                disabled={savingLimits}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                {savingLimits ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
                Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Free plan */}
              <LimitPanel title="Free Plan" color="blue" limits={freeLimits} onChange={updateLimit} />
              {/* Premium plan */}
              <LimitPanel title="Premium Plan" color="violet" limits={premiumLimits} onChange={updateLimit} />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">Per-user overrides</p>
              <p className="text-xs text-amber-700">You can also set individual card limits per user in <button onClick={() => navigate('/admin/users')} className="underline font-semibold">User Management</button>. Per-user limits override plan defaults.</p>
            </div>
          </div>
        )}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">All Transactions</h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Plan</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No transactions yet</td></tr>
                  )}
                  {transactions.map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 text-sm">{t.name || '—'}</p>
                        <p className="text-xs text-gray-400">{t.email}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold capitalize text-gray-700">{t.plan}</td>
                      <td className="px-4 py-3 text-gray-600">₹{Math.round(t.amount / 100)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          t.status === 'success' ? 'bg-green-100 text-green-700' :
                          t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'}`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg z-50 pointer-events-none">
          {toast}
        </div>
      )}
    </>
  )
}

function LimitPanel({ title, color, limits, onChange }) {
  const colorMap = {
    blue:   { badge: 'bg-blue-100 text-blue-700', border: 'border-blue-200', header: 'bg-blue-50/60' },
    violet: { badge: 'bg-violet-100 text-violet-700', border: 'border-violet-200', header: 'bg-violet-50/60' },
  }
  const c = colorMap[color]

  return (
    <div className={`bg-white border-2 ${c.border} rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all`}>
      <div className={`${c.header} px-5 py-3 flex items-center justify-between`}>
        <p className="text-sm font-bold text-gray-800">{title}</p>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${c.badge}`}>{limits.length} features</span>
      </div>
      <div className="divide-y divide-gray-50">
        {limits.map(l => (
          <div key={l.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors group border-b border-slate-50 last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{FEATURE_LABELS[l.feature_name] || l.feature_name}</p>
              <p className="text-xs text-gray-400">{l.feature_name}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Toggle enabled */}
              <button
                onClick={() => onChange(l.id, 'is_enabled', l.is_enabled ? 0 : 1)}
                className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${l.is_enabled ? 'bg-indigo-500' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${l.is_enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              {/* Limit value — only for numeric limits */}
              {l.limit_value !== null && (
                <input
                  type="number"
                  min="-1"
                  max="9999"
                  value={l.limit_value}
                  onChange={e => onChange(l.id, 'limit_value', parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  title="-1 = unlimited"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

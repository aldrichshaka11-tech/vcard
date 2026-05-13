import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, CreditCard, TrendingUp, ArrowRight, BarChart2, Eye, FileText, DollarSign, Shield } from 'lucide-react'
import axios from '../api/axios'
import { useAuth } from '../api/useAuth'
import Navbar from '../components/Navbar'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (authLoading) return
    if (!user) return
    if (!isAdmin()) { navigate('/dashboard'); return }
    loadAll()
  }, [authLoading, user])

  const loadAll = async () => {
    try {
      const [s, a] = await Promise.all([
        axios.get('/admin'),
        axios.get('/admin/analytics'),
      ])
      setStats(s.data.stats)
      setAnalytics(a.data)
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

  if (authLoading || loading) return (
    <><Navbar /><div className="flex items-center justify-center min-h-[70vh]"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div></>
  )

  const statCards = [
    { label: 'Total Users', value: stats?.total_users ?? 0, icon: <Users size={16} />, color: 'text-indigo-600', bg: 'bg-indigo-50', onClick: () => navigate('/admin/users') },
    { label: 'Basic Users', value: stats?.free_users ?? 0, icon: <Users size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Paid Users', value: stats?.premium_users ?? 0, icon: <CreditCard size={16} />, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Total Cards', value: analytics?.total_cards ?? 0, icon: <FileText size={16} />, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Total Views', value: analytics?.total_views ?? 0, icon: <Eye size={16} />, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Total Leads', value: analytics?.total_leads ?? 0, icon: <CreditCard size={16} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'New Users (7d)', value: analytics?.new_users_7d ?? 0, icon: <TrendingUp size={16} />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Views (7d)', value: analytics?.views_7d ?? 0, icon: <BarChart2 size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

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
          <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <Users size={15} /> Manage Users
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart2 size={14} /> },
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {statCards.map((s, i) => (
                <div
                  key={i}
                  onClick={s.onClick}
                  className={`card-stat rounded-2xl p-4 group ${s.onClick ? 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30' : ''}`}
                >
                  <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center ${s.color} mb-3 group-hover:scale-110 transition-transform`}>{s.icon}</div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  {s.onClick && <p className="text-xs text-indigo-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to view →</p>}
                </div>
              ))}
            </div>

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
              <button onClick={() => setActiveTab('transactions')} className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-green-300 hover:bg-green-50/40 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <DollarSign size={16} className="text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">Transactions</p>
                    <p className="text-xs text-gray-400">View all payment history</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-green-500 transition-colors" />
              </button>
            </div>
          </>
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
    </>
  )
}

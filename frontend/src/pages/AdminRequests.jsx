import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, X, Clock, CreditCard } from 'lucide-react'
import axios from '../api/axios'
import { useAuth } from '../api/useAuth'
import Navbar from '../components/Navbar'

const STATUS_STYLES = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function AdminRequests() {
  const navigate = useNavigate()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) return
    if (!isAdmin()) { navigate('/dashboard'); return }
    loadRequests()
  }, [filter, authLoading, user])

  const loadRequests = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? { status: filter } : { status: 'all' }
      const res = await axios.get('/admin/requests', { params })
      setRequests(res.data.requests || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (id, action) => {
    setActionLoading(`${id}-${action}`)
    try {
      const res = await axios.post(`/admin/requests/${id}/${action}`)
      if (res.status === 200) {
        loadRequests()
      }
    } catch (err) {
      console.error('Request action failed:', err)
      alert(err.response?.data?.error || `Failed to ${action} request. Please try again.`)
    } finally {
      setActionLoading(null)
    }
  }

  if (authLoading) return (
    <><Navbar /><div className="flex items-center justify-center min-h-[70vh]"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div></>
  )

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 min-h-screen bg-gray-50/50">

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft size={16} /> Admin
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-800">Premium Requests</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Premium Requests</h1>
            <p className="text-sm text-gray-500 mt-0.5">{requests.length} {filter !== 'all' ? filter : ''} requests</p>
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {['pending', 'approved', 'rejected', 'all'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : requests.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm hover:shadow-md transition-all">
            <CreditCard size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-400">No {filter !== 'all' ? filter : ''} requests found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
                req.status === 'pending' ? 'border-yellow-100 hover:border-yellow-200' :
                req.status === 'approved' ? 'border-green-100 hover:border-green-200' :
                'border-red-100 hover:border-red-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {req.email?.[0]?.toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate">{req.email}</p>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${STATUS_STYLES[req.status] || STATUS_STYLES.pending}`}>
                        {req.status}
                      </span>
                    </div>
                    {req.message && (
                      <p className="text-sm text-gray-500 mb-2 leading-relaxed">{req.message}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} /> {new Date(req.requested_at).toLocaleString()}</span>
                      {req.processed_at && <span>Reviewed: {new Date(req.processed_at).toLocaleString()}</span>}
                    </div>
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleRequest(req.id, 'approve')}
                        disabled={actionLoading === `${req.id}-approve`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all"
                      >
                        {actionLoading === `${req.id}-approve`
                          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <Check size={14} />
                        }
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequest(req.id, 'reject')}
                        disabled={actionLoading === `${req.id}-reject`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all"
                      >
                        {actionLoading === `${req.id}-reject`
                          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <X size={14} />
                        }
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

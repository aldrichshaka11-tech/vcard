import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../api/useAuth'
import Navbar from '../components/Navbar'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [status, setStatus] = useState('loading')
  const [plan, setPlan] = useState('')
  const orderId = searchParams.get('order_id')

  useEffect(() => {
    if (!orderId) { navigate('/pricing'); return }

    // If PhonePe redirects with a failure/cancel signal in URL
    const urlState = searchParams.get('state') || searchParams.get('code') || ''
    if (urlState && ['PAYMENT_CANCELLED', 'PAYMENT_ERROR', 'FAILED'].includes(urlState.toUpperCase())) {
      setStatus('failed')
      return
    }

    const check = async (attempts = 0) => {
      try {
        const res = await api.get(`/pay/status?order_id=${orderId}`)
        const payment = res.data.payment
        if (payment.status === 'success') {
          setPlan(payment.plan)
          setStatus('success')
          await refreshUser()
        } else if (payment.status === 'failed' || payment.status === 'cancelled') {
          setStatus('failed')
        } else if (attempts < 6) {
          setTimeout(() => check(attempts + 1), 2000)
        } else {
          // After 12 seconds still pending — likely cancelled
          setStatus('failed')
        }
      } catch {
        setStatus('failed')
      }
    }
    check()
  }, [orderId])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader size={48} className="animate-spin text-indigo-500 mx-auto" />
              <h2 className="text-xl font-bold text-gray-900">Verifying payment...</h2>
              <p className="text-gray-500 text-sm">Please wait, do not close this page.</p>
            </div>
          )}
          {status === 'success' && (
            <div className="space-y-5">
              <CheckCircle size={64} className="text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
              <p className="text-gray-500">
                Your <span className="font-semibold capitalize text-indigo-600">{plan}</span> plan is now active.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-violet-700 transition-all"
              >
                Go to Dashboard →
              </button>
            </div>
          )}
          {status === 'failed' && (
            <div className="space-y-5">
              <XCircle size={64} className="text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">Payment Cancelled</h2>
              <p className="text-gray-500">Your payment was not completed. No amount has been charged.</p>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
              >
                Try Again
              </button>
            </div>
          )}
          {status === 'pending' && (
            <div className="space-y-5">
              <Loader size={64} className="text-yellow-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">Payment Pending</h2>
              <p className="text-gray-500">Your payment is being processed. Please check back in a few minutes.</p>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
              >
                Back to Plans
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

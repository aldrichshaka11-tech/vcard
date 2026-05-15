import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import api from '../api/axios'

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.6 26.9 36 24 36c-5.2 0-9.7-2.9-11.3-7.1l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.2 5.2C41 35.3 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
  </svg>
)

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data)
      localStorage.removeItem('smartcard_editor')
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      // Redirect admin to admin panel, others to dashboard
      window.location.replace(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError('root', { message: err.response?.data?.error || 'Login failed.' })
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        }).then(r => r.json())
        const res = await api.post('/auth/google', { credential: tokenResponse.access_token, userInfo })
        localStorage.removeItem('smartcard_editor')
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        window.location.replace(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
      } catch (err) {
        setError('root', { message: err.response?.data?.error || 'Google login failed.' })
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => setError('root', { message: 'Google login was cancelled.' })
  })

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Roboto', sans-serif" }}>

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#10b981] flex-col justify-between p-12 relative">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="Kaira" className="w-10 h-10 object-contain" />
              <span className="text-white font-black text-2xl tracking-tight uppercase">KairavCard</span>
            </div>
            <Link to="/" className="text-white/80 hover:text-white text-sm font-bold transition-colors">← HOME</Link>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-5xl font-black text-white leading-[1.1] uppercase">Your digital<br />identity.</h2>
            <p className="text-white/80 mt-4 text-lg font-bold">Create a stunning digital business card and share it instantly with anyone, anywhere.</p>
          </div>

          <div className="space-y-3">
            {[
              { icon: '⚡', text: 'Create your card in under 2 minutes' },
              { icon: '📊', text: 'Track views and engagement in real time' },
              { icon: '🔗', text: 'Share via link, QR code, or NFC' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-sm flex-shrink-0">{item.icon}</div>
                <span className="text-white/80 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['#6366f1','#ec4899','#14b8a6','#f59e0b'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30" style={{ background: c }} />
              ))}
            </div>
            <p className="text-white/70 text-sm">Trusted by <span className="text-white font-semibold">10,000+</span> professionals</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#ede7e1]">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <span className="font-black text-[#1a1a1a] text-2xl uppercase tracking-tighter">KairavCard</span>
            <Link to="/" className="text-sm text-[#64748b] hover:text-[#10b981] transition-colors font-bold">← Home</Link>
          </div>

          <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Welcome back</h1>
              <p className="text-[#64748b] text-sm mt-2">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition"
                    {...register('email', { required: 'Email is required.' })}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3.5 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition"
                    {...register('password', { required: 'Password is required.' })}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {errors.root && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                  <span>⚠</span> {errors.root.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#1a1a1a] hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-full transition shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)]"
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <>Sign In <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <button
              type="button"
              onClick={() => googleLogin()}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed text-[#0F172A] font-bold text-sm rounded-full transition"
            >
              {googleLoading
                ? <div className="w-4 h-4 border-2 border-gray-200 border-t-[#10b981] rounded-full animate-spin" />
                : GOOGLE_SVG
              }
              Continue with Google
            </button>

            <p className="text-center text-sm text-[#64748b] mt-8">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#10b981] font-bold hover:text-[#367288] transition-colors">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

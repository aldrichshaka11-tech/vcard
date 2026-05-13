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
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
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
        navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
      } catch (err) {
        setError('root', { message: err.response?.data?.error || 'Google login failed.' })
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => setError('root', { message: 'Google login was cancelled.' })
  })

  return (
    <div className="min-h-screen flex bg-white">

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#4b98b4] flex-col justify-between p-12 relative">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="Kaira" className="w-10 h-10 object-contain" />
              <span className="text-white font-black text-2xl tracking-tight uppercase">Kaira</span>
            </div>
            <Link to="/" className="text-white/80 hover:text-white text-sm font-bold transition-colors">← HOME</Link>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-5xl font-black text-white leading-[1.1] uppercase">Your digital<br />identity.</h2>
            <p className="text-white/80 mt-4 text-lg font-bold">Create a stunning digital business card and share it instantly with anyone, anywhere.</p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '⚡', text: 'Create your card in under 2 minutes' },
              { icon: '📊', text: 'Track views and engagement in real time' },
              { icon: '🔗', text: 'Share via link, QR code, or NFC' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                <span className="text-white/90 font-bold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['JD','AS','RK','ML'].map((initial, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-[#4b98b4] bg-white/20 flex items-center justify-center text-white text-[10px] font-black">
                  {initial}
                </div>
              ))}
            </div>
            <p className="text-white/80 text-sm font-bold">Trusted by <span className="text-white">10,000+</span> professionals</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f8fafc]">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center justify-between mb-10 lg:hidden">
            <div className="flex items-center gap-2">
              <span className="font-black text-[#1a1a1a] text-2xl uppercase tracking-tighter">Kaira</span>
            </div>
            <Link to="/" className="text-sm font-black text-gray-400 hover:text-[#c14f3e] transition-colors">← HOME</Link>
          </div>

          <div className="bg-white rounded-[32px] border-2 border-[#f1f5f9] p-10 shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-[#1a1a1a] uppercase tracking-tight">Login</h1>
              <p className="text-gray-400 font-bold text-sm mt-1">Sign in to your professional account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Email address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-[#f1f5f9] rounded-2xl text-sm font-black text-[#1a1a1a] placeholder-gray-300 focus:outline-none focus:border-[#c14f3e] transition-all"
                    {...register('email', { required: 'Email is required.' })}
                  />
                </div>
                {errors.email && <p className="text-red-500 font-bold text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-[#f1f5f9] rounded-2xl text-sm font-black text-[#1a1a1a] placeholder-gray-300 focus:outline-none focus:border-[#4f46e5] transition-all"
                    {...register('password', { required: 'Password is required.' })}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c14f3e] transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 font-bold text-xs mt-1.5">{errors.password.message}</p>}
              </div>

              {errors.root && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-xs font-bold">
                  <span>⚠</span> {errors.root.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#c14f3e] hover:bg-[#a63d2f] disabled:opacity-60 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-red-100 uppercase tracking-widest active:scale-95"
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> ...</>
                ) : (
                  <>Sign In <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-[2px] bg-[#f1f5f9]" />
              <span className="text-[10px] text-gray-300 font-black tracking-widest">OR</span>
              <div className="flex-1 h-[2px] bg-[#f1f5f9]" />
            </div>

            <button
              type="button"
              onClick={() => googleLogin()}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white border-2 border-[#f1f5f9] hover:border-gray-200 text-[#1a1a1a] font-black text-sm rounded-2xl transition-all active:scale-95"
            >
              {googleLoading
                ? <div className="w-4 h-4 border-2 border-gray-200 border-t-[#c14f3e] rounded-full animate-spin" />
                : GOOGLE_SVG
              }
              Google login
            </button>

            <p className="text-center text-xs font-bold text-gray-400 mt-8">
              New here?{' '}
              <Link to="/register" className="text-[#c14f3e] font-black hover:underline uppercase tracking-wide ml-1">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

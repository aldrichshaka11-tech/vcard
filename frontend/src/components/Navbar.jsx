import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { CreditCard, LayoutDashboard, LogOut, Pencil, Crown, Sparkles, Shield } from 'lucide-react'
import { useAuth } from '../api/useAuth'
import Notifications from './Notifications'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAdmin, isPro, isAdvanced, isBasic } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('smartcard_editor')
    navigate('/')
    setMobileMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 mobile-safe-area">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
            <CreditCard size={14} className="sm:text-base text-white" />
          </div>
          <span className="font-bold text-base sm:text-lg gradient-text group-hover:opacity-80 transition-opacity">SmartCard</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-0.5 sm:gap-1">
          <Link to="/dashboard" className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm hover:scale-105'}`}>
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link to="/editor" className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/editor') ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm hover:scale-105'}`}>
            <Pencil size={14} />
            <span className="hidden sm:inline">Editor</span>
          </Link>

          {(isPro() || isAdvanced()) && (
            <Link to="/pricing" className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/pricing') ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}>
              <Crown size={14} />
              <span className="hidden sm:inline">{isAdvanced() ? 'Advanced' : 'Pro'}</span>
            </Link>
          )}

          {isBasic() && (
            <Link to="/pricing" className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 hover:scale-105 hover:shadow-md transition-all duration-200">
              <Sparkles size={14} />
              <span className="hidden sm:inline">Upgrade</span>
            </Link>
          )}
          {isAdmin() && (
            <Link to="/admin" className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname.startsWith('/admin') ? 'bg-purple-50 text-purple-600 shadow-sm' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:shadow-sm hover:scale-105'}`}>
              <Shield size={14} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-0.5 sm:gap-1">
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <Notifications />
          {user?.name && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-all duration-200 cursor-default">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user.name[0].toUpperCase()}
              </div>
              <span className="text-sm text-gray-600 font-medium">{user.name}</span>
              {isPro() && !isAdvanced() && <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-semibold">PRO</span>}
              {isAdvanced() && <span className="text-xs bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded font-semibold">ADV</span>}
            </div>
          )}
          <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 hover:scale-105 hover:shadow-sm transition-all duration-200">
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors -mr-2" aria-label="Toggle menu">
          <div className="w-5 h-5 relative flex flex-col justify-center">
            <span className={`block absolute h-0.5 w-5 bg-gray-600 transform transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`} />
            <span className={`block h-0.5 w-5 bg-gray-600 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block absolute h-0.5 w-5 bg-gray-600 transform transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <LayoutDashboard size={16} /><span>Dashboard</span>
            </Link>

            <Link to="/editor" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/editor') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Pencil size={16} /><span>Editor</span>
            </Link>

            {(isPro() || isAdvanced()) && (
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/pricing') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Crown size={16} /><span>{isAdvanced() ? 'Advanced' : 'Pro'}</span>
              </Link>
            )}

            {isBasic() && (
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <Sparkles size={16} /><span>Upgrade</span>
              </Link>
            )}

            {isAdmin() && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname.startsWith('/admin') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Shield size={16} /><span>Admin</span>
              </Link>
            )}

            <div className="border-t border-gray-200 my-2" />

            <div className="flex items-center gap-3 px-3 py-2.5">
              <Notifications />
              {user?.name && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    {isPro() && !isAdvanced() && <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-semibold">PRO</span>}
                    {isAdvanced() && <span className="text-xs bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded font-semibold">ADV</span>}
                  </div>
                </div>
              )}
            </div>

            <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full">
              <LogOut size={16} /><span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

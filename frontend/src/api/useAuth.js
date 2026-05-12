import { useState, useEffect, useContext, createContext } from 'react'
import api from './axios'

export const FEATURES = {
  COVER_PHOTO:        'cover_photo',
  COMPANY_LOGO:       'company_logo',
  VIRTUAL_BACKGROUND: 'virtual_background',
  CUSTOM_COLORS:      'custom_colors',
  THEME_COLORS:       'theme_colors',
  SOCIAL_LINKS:       'social_links',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  CUSTOM_FIELDS:      'custom_fields',
  LEAD_CAPTURE:       'lead_capture',
  CSV_EXPORT:         'csv_export',
  CUSTOM_SLUG:        'custom_slug',
}

// Plan levels: basic=0, pro=1, advanced=2, admin=99
const PLAN_LEVELS = { basic: 0, free: 0, user: 0, pro: 1, premium: 1, advanced: 2, admin: 99 }
const planLevel = (role) => PLAN_LEVELS[role] ?? 0

export const AuthContext = createContext(null)
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function useAuthState() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })
  const [features, setFeatures] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    const init = async () => {
      try {
        const res = await api.get('/auth/me')
        const freshUser = res.data.user
        localStorage.setItem('user', JSON.stringify(freshUser))
        setUser(freshUser)
        // Only fetch features for non-admin users
        if (freshUser.role !== 'admin') {
          try {
            const fr = await api.get('/premium/features')
            setFeatures(fr.data.features)
          } catch {}
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          const cached = localStorage.getItem('user')
          if (cached) try { setUser(JSON.parse(cached)) } catch {}
        }
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const isAdmin    = () => user?.role === 'admin'
  const isAdvanced = () => planLevel(user?.role) >= 2 || user?.role === 'admin'
  const isPro      = () => planLevel(user?.role) >= 1 || user?.role === 'admin'
  const isBasic    = () => planLevel(user?.role) === 0
  // keep isPremium as alias for isPro for backward compat
  const isPremium  = () => isPro()
  const isFree     = () => isBasic()
  const isPending  = () => user?.plan_status === 'pending'

  const getPlanLevel = () => planLevel(user?.role)

  const canAccessFeature = (featureName) => {
    if (isAdmin()) return true
    // Feature access by plan
    const featurePlanMap = {
      cover_photo:         1,  // pro+
      company_logo:        1,
      custom_color_picker: 1,
      advanced_analytics:  1,
      custom_fields:       1,
      lead_capture:        1,
      virtual_background:  1,  // pro+
      csv_export:          2,  // advanced only
      custom_slug:         2,
    }
    const required = featurePlanMap[featureName] ?? 0
    return getPlanLevel() >= required
  }

  const getFeatureLimit = (featureName) => {
    if (isAdmin()) return -1
    if (isAdvanced()) {
      return -1  // unlimited everything
    }
    if (isPro()) {
      const proLimits = {
        theme_colors: -1, social_links: -1, cover_photo: 1,
        company_logo: 1, custom_colors: 1, lead_capture: 1,
        advanced_analytics: 1, custom_fields: 1,
        virtual_background: 1, csv_export: 0, custom_slug: 0,
      }
      return proLimits[featureName] ?? -1
    }
    // basic
    const basicLimits = {
      theme_colors: 10, social_links: 5,
      cover_photo: 0, company_logo: 0, virtual_background: 0,
      custom_colors: 0, lead_capture: 0, csv_export: 0, custom_slug: 0,
      advanced_analytics: 0, custom_fields: 0,
    }
    return basicLimits[featureName] ?? -1
  }

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me')
      const freshUser = res.data.user
      localStorage.setItem('user', JSON.stringify(freshUser))
      setUser(freshUser)
    } catch {}
  }

  return {
    user, features, loading,
    isAdmin, isAdvanced, isPro, isBasic,
    isPremium, isFree, isPending,
    getPlanLevel, canAccessFeature, getFeatureLimit, refreshUser,
  }
}

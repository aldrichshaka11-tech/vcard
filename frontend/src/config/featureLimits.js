// Feature limits for different user types
export const FEATURE_LIMITS = {
  // Free users get 10 basic colors
  THEME_COLORS: {
    free: 10,
    premium: -1, // unlimited (all 20 colors)
    admin: -1 // unlimited
  },
  
  // Other features can be added here
  COVER_PHOTO: {
    free: 0, // not available
    premium: -1, // unlimited
    admin: -1
  },
  
  COMPANY_LOGO: {
    free: 0, // not available
    premium: -1, // unlimited
    admin: -1
  },
  
  VIRTUAL_BACKGROUND: {
    free: 0, // not available
    premium: -1, // unlimited
    admin: -1
  },
  
  CUSTOM_COLORS: {
    free: 0, // not available
    premium: -1, // unlimited
    admin: -1
  }
}

// Helper function to get feature limit
export const getFeatureLimit = (featureName, userRole, planStatus) => {
  const limits = FEATURE_LIMITS[featureName]
  if (!limits) return -1 // unlimited if not defined
  
  // Admin gets unlimited access
  if (userRole === 'admin') return limits.admin
  
  // Premium users get unlimited access
  if (userRole === 'premium' || planStatus === 'active') return limits.premium
  
  // Free users get limited access
  return limits.free
}

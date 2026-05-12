import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, FEATURES } from '../api/useAuth';

export default function FeatureGate({ feature, children, fallback = null }) {
  const navigate = useNavigate();
  const { canAccessFeature, isPremium, isPending } = useAuth();

  if (canAccessFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-40 blur-[2px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50/90 to-indigo-50/90 backdrop-blur-sm rounded-lg border-2 border-purple-200">
        <div className="text-center p-4">
          <Lock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-900 mb-1">Premium Feature</p>
          <p className="text-xs text-gray-600 mb-3">Upgrade to unlock this feature</p>
          {isPending() ? (
            <div className="text-xs text-orange-600 font-medium">
              Your upgrade request is pending approval
            </div>
          ) : (
            <button
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              Upgrade Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { FEATURES };

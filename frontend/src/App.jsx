import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { useAuth } from './api/useAuth'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const EditorPublicCard = lazy(() => import('./pages/EditorPublicCard'))
const ProfileEditor = lazy(() => import('./editor/ProfileEditor'))

const Pricing = lazy(() => import('./pages/Pricing'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/AdminUsers'))
const AdminRequests = lazy(() => import('./pages/AdminRequests'))

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

function PrivateRoute({ children }) {
  const { loading } = useAuth()
  const token = localStorage.getItem('token')

  if (!token) return <Navigate to="/login" replace />

  // Check JWT expiry
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return <Navigate to="/login" replace />
    }
  } catch {}

  // Wait for /auth/me to complete before rendering protected page
  if (loading) return <Spinner />

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/editor"    element={<PrivateRoute><ProfileEditor /></PrivateRoute>} />
          <Route path="/upgrade"   element={<Navigate to="/pricing" replace />} />
          <Route path="/pricing"   element={<PrivateRoute><Pricing /></PrivateRoute>} />
          <Route path="/payment/success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
          <Route path="/admin"     element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/requests" element={<PrivateRoute><AdminRequests /></PrivateRoute>} />
          <Route path="/card/id/:cardId" element={<EditorPublicCard />} />
          <Route path="/card/:slug" element={<EditorPublicCard />} />
          <Route path="/"          element={<Home />} />
          <Route path="/:slug"     element={<EditorPublicCard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

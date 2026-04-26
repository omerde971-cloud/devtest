import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth.store'

import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Pricing from '@/pages/Pricing'
import Report from '@/pages/Report'
import ProtectedRoute from '@/components/ProtectedRoute'

const queryClient = new QueryClient()

export default function App() {
  const { token } = useAuthStore()

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/dashboard" replace /> : <Register />}
          />
          <Route path="/pricing" element={<Pricing />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/:id"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  )
}

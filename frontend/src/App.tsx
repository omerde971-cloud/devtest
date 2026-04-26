import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<div>Landing Page (Coming Soon)</div>} />
            <Route path="/login" element={<div>Login Page (Coming Soon)</div>} />
            <Route path="/dashboard" element={<div>Dashboard (Coming Soon)</div>} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

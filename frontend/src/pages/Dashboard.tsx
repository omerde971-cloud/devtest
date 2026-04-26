import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DevTest</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Hoş geldin, <strong>{user?.username || user?.email}</strong></span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Phase 1: Auth tamamlandı! Sırada file upload ve analysis engines var.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-gray-700 font-medium mb-2">Toplam Analiz</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-500 mt-1">Bu ay</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-gray-700 font-medium mb-2">Başarılı</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-500 mt-1">Tamamlanan</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-gray-700 font-medium mb-2">Plan</h3>
              <p className="text-lg font-bold text-purple-600">Free</p>
              <p className="text-sm text-gray-500 mt-1">Upgrade et</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-yellow-900 mb-2">🚀 Sırada Neler Var?</h3>
            <ul className="text-yellow-800 space-y-1 text-sm">
              <li>✅ Auth Pages (Login/Register) - Done!</li>
              <li>🔄 File Upload Handler</li>
              <li>🔄 iOS IPA Parser</li>
              <li>🔄 Android APK Parser</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

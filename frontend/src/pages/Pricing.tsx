import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { apiClient } from '@/api/client'
import toast from 'react-hot-toast'

export default function Pricing() {
  const navigate = useNavigate()
  const { token, user } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async (plan: 'pro' | 'plus') => {
    if (!token) {
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.createCheckoutSession(plan)
      window.location.href = response.url
    } catch (error: any) {
      toast.error('Upgrade başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Fiyatlandırma</h1>
          <p className="text-gray-600 mt-2">Planını seç ve DevTest'i kullanmaya başla</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900">Free</h3>
              <p className="text-gray-600 mt-2">Başlangıç için perfect</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">/ay</span>
              </div>
            </div>

            <ul className="px-8 py-4 space-y-4 text-gray-600">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>IPA/APK: Sınırsız</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Diğerleri: 2/ay</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Temel Analiz</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gray-400">✗</span>
                <span>Session Replay</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gray-400">✗</span>
                <span>PDF Export</span>
              </li>
            </ul>

            <div className="px-8 py-6">
              <button disabled className="w-full bg-gray-400 text-white px-4 py-2 rounded-lg font-medium cursor-not-allowed">
                Mevcut Plan
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500">
            <div className="bg-blue-500 text-white px-8 py-4 text-center">
              <span className="text-sm font-bold">POPULAR</span>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
              <p className="text-gray-600 mt-2">Çoğu developer için</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$2.99</span>
                <span className="text-gray-600 ml-2">/ay</span>
              </div>
            </div>

            <ul className="px-8 py-4 space-y-4 text-gray-600">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Hepsinde Sınırsız</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>50K Crash/ay</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Session Replay</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>PDF Export</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gray-400">✗</span>
                <span>Performance Monitoring</span>
              </li>
            </ul>

            <div className="px-8 py-6">
              <button
                onClick={() => handleUpgrade('pro')}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {loading ? 'İşleniyor...' : 'Pro\'ya Yükselt'}
              </button>
            </div>
          </div>

          {/* Plus Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900">Plus</h3>
              <p className="text-gray-600 mt-2">Büyüyen ekipler için</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                <span className="text-gray-600 ml-2">/ay</span>
              </div>
            </div>

            <ul className="px-8 py-4 space-y-4 text-gray-600">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Hepsinde Sınırsız</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>250K Crash/ay</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Session Replay</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Performance Monitoring</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Security Scanning</span>
              </li>
            </ul>

            <div className="px-8 py-6">
              <button
                onClick={() => handleUpgrade('plus')}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {loading ? 'İşleniyor...' : 'Plus\'a Yükselt'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

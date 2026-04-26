import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { apiClient } from '@/api/client'
import FileUpload from '@/components/FileUpload'
import { Analysis } from '@/types'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      const data = await apiClient.getAnalyses()
      setAnalyses(data)
    } catch (error) {
      console.error('Failed to fetch analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleUploadComplete = (newAnalysis: Analysis) => {
    setAnalyses([newAnalysis, ...analyses])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
            <span className="text-gray-700">
              Hoş geldin, <strong>{user?.username || user?.email}</strong>
            </span>
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
        {/* Upload Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yeni Analiz</h2>
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>

        {/* Analyses List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Geçmiş Analizler</h3>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Yükleniyor...</div>
          ) : analyses.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Henüz analiz yapılmamış. Yukarıdan bir dosya yükleyerek başla.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {analyses.map((analysis) => (
                <div key={analysis.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <Link to={`/reports/${analysis.id}`} className="flex-1 cursor-pointer">
                      <h4 className="font-medium text-blue-600 hover:text-blue-700">
                        {analysis.fileName}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{analysis.platform.toUpperCase()}</span>
                        <span>{(analysis.fileSize / 1024 / 1024).toFixed(2)}MB</span>
                        <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          analysis.status
                        )}`}
                      >
                        {analysis.status === 'queued' && '⏳ Sıraya alındı'}
                        {analysis.status === 'processing' && '⚙️ İşleniyor'}
                        {analysis.status === 'completed' && '✅ Tamamlandı'}
                        {analysis.status === 'failed' && '❌ Başarısız'}
                      </span>
                      {analysis.status === 'completed' && analysis.healthScore && (
                        <span className="text-lg font-bold text-green-600">
                          {analysis.healthScore}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

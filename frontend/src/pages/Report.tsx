import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '@/api/client'
import { Analysis } from '@/types'
import toast from 'react-hot-toast'

export default function Report() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('summary')

  useEffect(() => {
    if (!id) return

    const fetchReport = async () => {
      try {
        const data = await apiClient.getAnalysis(id)
        setAnalysis(data)
      } catch (error: any) {
        toast.error('Report bulunamadı')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Report yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{analysis.fileName}</h1>
          <p className="text-gray-600 mt-2">
            {analysis.platform.toUpperCase()} • {(analysis.fileSize / 1024 / 1024).toFixed(2)}MB
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4">Health Score</h3>
              <div className="text-center">
                <div
                  className={`text-6xl font-bold ${getHealthScoreColor(
                    analysis.healthScore || 0
                  )}`}
                >
                  {analysis.healthScore || 0}
                </div>
                <p className="text-gray-600 mt-2">/100</p>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                  📥 PDF Export
                </button>
                <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium">
                  🔗 Share Report
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="flex border-b border-gray-200">
                {['summary', 'metadata', 'security', 'dependencies'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium border-b-2 transition ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'summary' && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Key Findings</h3>
                    <div className="space-y-2">
                      {analysis.reportData?.security?.findings?.map((finding: string, idx: number) => (
                        <p key={idx} className="text-gray-700">
                          • {finding}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'metadata' && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">App Name</p>
                      <p className="font-medium text-gray-900">
                        {analysis.reportData?.metadata?.appName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Version</p>
                      <p className="font-medium text-gray-900">
                        {analysis.reportData?.metadata?.version}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Min OS</p>
                      <p className="font-medium text-gray-900">
                        {analysis.reportData?.metadata?.minOS}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">
                      Risk Level:{' '}
                      <span
                        className={
                          analysis.reportData?.security?.riskLevel === 'low'
                            ? 'text-green-600'
                            : analysis.reportData?.security?.riskLevel === 'medium'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }
                      >
                        {analysis.reportData?.security?.riskLevel?.toUpperCase()}
                      </span>
                    </h3>
                    <div className="space-y-2">
                      {analysis.reportData?.security?.findings?.map((finding: string, idx: number) => (
                        <p key={idx} className="text-gray-700">
                          • {finding}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'dependencies' && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Frameworks/Libraries</h3>
                    <div className="space-y-2">
                      {analysis.reportData?.frameworks?.map((fw: string, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-gray-900">{fw}</span>
                          <span className="text-sm text-gray-500">✓ Compatible</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

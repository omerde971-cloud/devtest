import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export default function Landing() {
  const navigate = useNavigate()
  const { token } = useAuthStore()

  if (token) {
    navigate('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Navigation */}
      <nav className="bg-blue-900 bg-opacity-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">DevTest</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition"
            >
              Kayıt Ol
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-5xl font-bold text-white mb-4">
          iOS & Android Apps için Unified Test Platform
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          IPA, APK, dSYM dosyalarını yükle. Anında app metadatası, güvenlik analizi ve crash log'ları al.
        </p>

        <button
          onClick={() => navigate('/register')}
          className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition inline-block"
        >
          Hemen Başla (Ücretsiz)
        </button>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">Özellikler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="text-4xl mb-4">📱</div>
            <h4 className="font-bold text-xl mb-2">Çoklu Format Desteği</h4>
            <p>IPA, APP, APK, AAB, dSYM, XCArchive - hepsini analiz et.</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="font-bold text-xl mb-2">Anında Analiz</h4>
            <p>Dosya yükle, 30 saniye içinde detaylı rapor al.</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="text-4xl mb-4">🔒</div>
            <h4 className="font-bold text-xl mb-2">Güvenlik Taraması</h4>
            <p>Permissions, entitlements ve güvenlik riskleri otomatik detekt.</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="font-bold text-xl mb-2">Health Score</h4>
            <p>App kalitesini 0-100 skalasında değerlendir.</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="text-4xl mb-4">🔗</div>
            <h4 className="font-bold text-xl mb-2">Paylaşılabilir Raporlar</h4>
            <p>Raporları takım üyeleriyle güvenli link ile paylaş.</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <div className="text-4xl mb-4">💰</div>
            <h4 className="font-bold text-xl mb-2">Uygun Fiyat</h4>
            <p>$2.99/ay Pro plan ile tüm özellikleri kullan.</p>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">Basit Fiyatlandırma</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-8">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Free</h4>
            <p className="text-gray-600">Her zaman ücretsiz</p>
            <div className="text-3xl font-bold text-blue-600 my-4">$0/ay</div>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>✓ IPA/APK: Sınırsız</li>
              <li>✓ Diğerleri: 2/ay</li>
              <li>✓ Temel Analiz</li>
            </ul>
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Başla
            </button>
          </div>

          <div className="bg-white rounded-lg p-8 border-2 border-blue-600">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Pro</h4>
            <p className="text-gray-600">Çoğu developer için perfect</p>
            <div className="text-3xl font-bold text-blue-600 my-4">$2.99/ay</div>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>✓ Hepsinde Sınırsız</li>
              <li>✓ 50K Crash/ay</li>
              <li>✓ Session Replay</li>
              <li>✓ PDF Export</li>
            </ul>
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Pro'ya Yükselt
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-blue-400 border-opacity-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-blue-100">
          <p>© 2026 DevTest. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

const features = [
  { icon: '📱', title: 'Çoklu Format Desteği', desc: 'IPA, APP, APK, AAB, dSYM, XCArchive - hepsini analiz et.' },
  { icon: '⚡', title: 'Anında Analiz', desc: 'Dosya yükle, 30 saniye içinde detaylı rapor al.' },
  { icon: '🔒', title: 'Güvenlik Taraması', desc: 'Permissions, entitlements ve güvenlik riskleri otomatik detekt.' },
  { icon: '📊', title: 'Health Score', desc: 'App kalitesini 0-100 skalasında değerlendir.' },
  { icon: '🌐', title: 'Paylaşılabilir Raporlar', desc: 'Analiz sonuçlarını takım ile güvenli linkler üzerinden paylaş.' },
  { icon: '💰', title: 'Uygun Fiyat', desc: '$2.99/ay - unlimited analiz, raporlar ve paylaşım.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { token } = useAuthStore()

  if (token) {
    navigate('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative backdrop-blur-md bg-slate-900 bg-opacity-50 border-b border-blue-500 border-opacity-20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent animate-in fade-in duration-700">
            DevTest
          </h1>
          <div className="space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="text-slate-200 hover:text-white px-5 py-2 rounded-lg transition-all duration-300 hover:bg-slate-700 hover:bg-opacity-50 font-medium"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
            >
              Kayıt Ol
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="animate-in fade-in slide-in-from-bottom duration-1000">
          <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
            iOS & Android Apps için
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Unified Test Platform
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            IPA, APK, dSYM dosyalarını yükle. Anında app metadatası, güvenlik analizi ve crash log'ları al.
          </p>

          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 inline-block"
          >
            🚀 Hemen Başla (Ücretsiz)
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          <h3 className="text-4xl font-bold text-white mb-4">Neden DevTest?</h3>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative animate-in fade-in slide-in-from-bottom duration-1000"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
              <div className="relative bg-slate-800 bg-opacity-50 backdrop-blur-xl rounded-xl p-8 text-white border border-slate-700 group-hover:border-blue-500 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">{feature.icon}</div>
                <h4 className="font-bold text-xl mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-4xl mx-auto px-4 py-20 text-center animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-12 border border-blue-500/30">
          <h3 className="text-3xl font-bold text-white mb-4">
            Hazır mısın?
          </h3>
          <p className="text-slate-300 mb-8 text-lg">
            Hemen başla ve iOS/Android uygulamalarını analiz et
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105"
          >
            Ücretsiz Başla
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-slate-700 mt-20 py-8 text-center text-slate-400">
        <p>© 2026 DevTest. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}

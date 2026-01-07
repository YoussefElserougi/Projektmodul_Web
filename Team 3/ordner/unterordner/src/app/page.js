import Link from 'next/link'
import { Mail, BarChart3, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Hero Section */}
      <div className="mb-12 animate-fade-in">
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-atolls-dark">Atolls</span>
          <span className="text-atolls-orange"> Review</span>
          <span className="text-atolls-dark"> Hub</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-gestützte Review-Verwaltung für mydealz, Shoop & Cuponation
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Link href="/inbox">
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-atolls-orange">
            <Mail className="w-16 h-16 mx-auto mb-4 text-atolls-orange" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Review Inbox</h2>
            <p className="text-gray-600 mb-4">
              Verwalte und beantworte eingehende Reviews mit KI-Unterstützung
            </p>
            <div className="flex items-center justify-center text-atolls-orange font-semibold">
              Öffnen →
            </div>
          </div>
        </Link>

        <Link href="/insights">
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-atolls-orange">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-atolls-orange" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Insights Dashboard</h2>
            <p className="text-gray-600 mb-4">
              Analysiere Trends, Sentiment und erkenne Probleme frühzeitig
            </p>
            <div className="flex items-center justify-center text-atolls-orange font-semibold">
              Öffnen →
            </div>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold text-atolls-orange">100%</div>
          <div className="text-gray-600">AI-Powered</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-atolls-orange">24/7</div>
          <div className="text-gray-600">Monitoring</div>
        </div>
        <div>
          <Zap className="w-10 h-10 mx-auto mb-2 text-atolls-orange" />
          <div className="text-gray-600">Real-time</div>
        </div>
      </div>
    </div>
  )
}
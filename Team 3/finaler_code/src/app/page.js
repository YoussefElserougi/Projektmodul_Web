import Link from 'next/link'
import { Mail, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Hero Section */}
      <div className="mb-12 animate-fade-in">
        <h1 className="text-6xl font-bold mb-4 text-fg">
          Atolls Review Hub
        </h1>

      </div>

      {/* CTA Buttons */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Link href="/inbox">
          <div className="group bg-surface p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-border hover:border-cta-secondary min-h-72">
            <Mail className="w-16 h-16 mx-auto mb-4 text-cta-secondary" />
            <h2 className="text-2xl font-bold mb-2 text-fg">Review Inbox</h2>
            <p className="text-muted mb-4">
              Manage and respond to incoming reviews with AI support.
            </p>
          </div>
        </Link>

        <Link href="/insights">
          <div className="group bg-surface p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-border hover:border-cta-secondary min-h-72">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-cta-secondary" />
            <h2 className="text-2xl font-bold mb-2 text-fg">Insights Dashboard</h2>
            <p className="text-muted mb-4">
              Analyze trends, sentiment and detect issues early.
            </p>
          </div>
        </Link>
      </div>


    </div>
  )
}
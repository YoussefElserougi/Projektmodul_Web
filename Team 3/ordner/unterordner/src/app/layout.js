import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Atolls Review Management',
  description: 'AI-powered review management system for Atolls',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
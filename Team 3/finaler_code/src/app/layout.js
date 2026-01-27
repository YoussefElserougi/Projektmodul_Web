import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Atolls Review Management',
  description: 'AI-powered review management system for Atolls',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const stored = localStorage.getItem('theme');
    const theme = stored || 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body>
        <div className="min-h-screen bg-bg">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
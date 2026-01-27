'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Mail, BarChart3, Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [hoveredLink, setHoveredLink] = useState(null)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem('theme', next)
    } catch (e) {}
    if (next === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/inbox', label: 'Inbox', icon: Mail },
    { href: '/insights', label: 'Insights', icon: BarChart3 },
  ]

  return (
    <nav className="bg-surface/90 text-fg shadow-md sticky top-0 z-50 border-b border-border backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="text-2xl font-bold tracking-wide" style={{ fontWeight: '800', letterSpacing: '0.02em' }}>
                atolls
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-2 items-center">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link key={href} href={href}>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${
                      isActive
                        ? 'bg-surface2 border-border'
                        : 'border-transparent hover:bg-surface hover:border-border'
                    }`}
                    style={{
                      color: hoveredLink === href && !isActive ? 'var(--cta-secondary)' : undefined,
                    }}
                    onMouseEnter={() => setHoveredLink(href)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                </Link>
              )
            })}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-surface2 hover:bg-surface transition-colors"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
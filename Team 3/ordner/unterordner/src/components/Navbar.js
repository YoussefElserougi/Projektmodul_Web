'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Mail, BarChart3 } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/inbox', label: 'Inbox', icon: Mail },
    { href: '/insights', label: 'Insights', icon: BarChart3 },
  ]

  return (
    <nav className="bg-white text-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="text-2xl font-bold">
                <span className="text-atolls-dark">atolls</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-2">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link key={href} href={href}>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-atolls-orange text-white shadow-lg'
                        : 'text-gray-600 hover:text-atolls-orange hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
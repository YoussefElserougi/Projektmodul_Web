'use client'

import { AlertCircle, AlertTriangle, Info } from 'lucide-react'

export default function AlertBanner({ alert }) {
  const config = {
    critical: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-800',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-800',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-800',
    },
  }

  const style = config[alert.type] || config.info
  const Icon = style.icon

  return (
    <div className={`${style.bgColor} ${style.borderColor} ${style.textColor} border-2 rounded-lg p-4 flex items-start gap-3 animate-fade-in`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-sm leading-relaxed">
          {alert.message}
        </p>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle, TrendingDown, AlertCircle, Lightbulb, BarChart3 } from 'lucide-react'

export default function WarningPopup({ warnings, onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (warnings && warnings.length > 0) {
      setTimeout(() => setIsVisible(true), 100)
    }
  }, [warnings])

  if (!warnings || warnings.length === 0) return null

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(), 300)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div 
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="bg-surface2 rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="p-6 text-white" style={{ backgroundColor: '#FF804D' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 animate-pulse" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Warnung!</h2>
                  </div>
                  <p className="text-red-100 text-sm mt-1">
                    {warnings.length} kritische {warnings.length === 1 ? 'Benachrichtigung' : 'Benachrichtigungen'} erfordern Ihre Aufmerksamkeit
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {warnings.map((warning, index) => (
                <div 
                  key={index}
                  className="bg-red-50 border-2 border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {warning.type === 'negative_streak' ? (
                      <TrendingDown className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-red-900 mb-1">
                        {warning.title}
                      </h3>
                      <p className="text-red-700 text-sm leading-relaxed">
                        {warning.message}
                      </p>
                      {warning.details && (
                        <div className="mt-3 pt-3 border-t border-red-200">
                          <p className="text-xs text-red-600 font-medium flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            {warning.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-surface p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Tip: Review these trends soon so you can respond proactively.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-cta-primary hover:bg-cta-primary-hover text-black font-semibold rounded-lg transition-colors shadow-md"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

'use client'

import { Calendar, TrendingUp } from 'lucide-react'

export default function TimeFilter({ activeFilter, setActiveFilter }) {
  const filters = [
    { id: 'day', label: 'Day'},
    { id: 'month', label: 'Month'},
    { id: 'year', label: 'Year'}
  ]

  return (
    <div className="bg-surface p-4 rounded-xl shadow-lg border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted">
          <Calendar className="w-5 h-5 text-cta-secondary" />
          <span className="font-semibold">Time range:</span>
        </div>
        
        <div className="flex gap-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
                flex items-center gap-2
                ${activeFilter === filter.id 
                  ? 'bg-cta-secondary text-black shadow-md scale-105' 
                  : 'bg-surface2 text-muted hover:bg-surface'
                }
              `}
            >
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Info Text */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Filtering is currently visual-only. Full implementation is in progress.
        </p>
      </div>
    </div>
  )
}

'use client'

export default function KeywordRadar({ keywords }) {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted">
        <p>No issue data available</p>
      </div>
    )
  }

  // Beispiel Datenformat von n8n:
  // [ { keyword: "management", count: 15, change: 12 } ]

  // ============================================================
  // 🚨 DEMO DATA - REMOVE AFTER PRESENTATION 🚨
  // Diese gefakten Trend-Werte simulieren Änderungen für die Demo
  const DEMO_TRENDS = {
    'salary': +8,
    'management': -3,
    'career-development': +5,
    'communication': +2,
    'organization': -1,
  }
  // ============================================================

  function getTrendIcon(change) {
    if (change > 0) return '📈'
    if (change < 0) return '📉'
    return '➖'
  }

  function getTrendColor(change) {
    if (change > 0) return 'text-red-600 bg-red-50'
    if (change < 0) return 'text-green-600 bg-green-50'
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="space-y-3">
      {keywords.slice(0, 5).map((keyword, index) => {
        const maxCount = Math.max(...keywords.map(k => k.count))
        const widthPercent = (keyword.count / maxCount) * 100

        // ============================================================
        // 🚨 DEMO: Nutze gefakte Trends wenn echte Daten 0 sind 🚨
        const realChange = keyword.change
        const demoChange = DEMO_TRENDS[keyword.keyword] ?? (index % 2 === 0 ? +3 : -2)
        const displayChange = realChange !== 0 ? realChange : demoChange
        // ============================================================

        return (
          <div key={index} className="space-y-1">
            {/* Keyword Header */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-fg">
                  {index + 1}. {keyword.keyword}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${getTrendColor(displayChange)}`}>
                  {getTrendIcon(displayChange)}
                  {displayChange > 0 ? '+' : ''}{displayChange}%
                </span>
              </div>
              <span className="font-semibold text-muted">
                {keyword.count}x
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface2 rounded-full h-3 overflow-hidden border border-border">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${widthPercent}%`, backgroundColor: '#FF804D' }}
              />
            </div>
          </div>
        )
      })}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted font-medium">
          💡 These keywords appear most frequently in negative reviews
        </p>
      </div>
    </div>
  )
}
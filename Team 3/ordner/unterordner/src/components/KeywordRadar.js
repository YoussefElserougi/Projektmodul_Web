'use client'

export default function KeywordRadar({ keywords }) {
  // Fallback wenn keine Daten
  if (!keywords || keywords.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <p>Keine Problem-Daten verfügbar</p>
      </div>
    )
  }

  // Beispiel Datenformat von n8n:
  // [ { keyword: "management", count: 15, change: 12 } ]

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

        return (
          <div key={index} className="space-y-1">
            {/* Keyword Header */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">
                  {index + 1}. {keyword.keyword}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${getTrendColor(keyword.change)}`}>
                  {getTrendIcon(keyword.change)}
                  {keyword.change > 0 ? '+' : ''}{keyword.change}%
                </span>
              </div>
              <span className="font-semibold text-gray-600">
                {keyword.count}x
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-atolls-orange to-red-500 transition-all duration-500 rounded-full"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          </div>
        )
      })}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t-2 border-gray-200">
        <p className="text-xs text-gray-500 font-medium">
          💡 Diese Keywords tauchen am häufigsten in negativen Reviews auf
        </p>
      </div>
    </div>
  )
}
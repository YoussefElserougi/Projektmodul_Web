export default function StatCard({ title, value, subtitle, icon: Icon, color = 'bg-white border-gray-100' }) {
  return (
    <div className={`${color} p-6 rounded-2xl shadow-lg border-2 hover:scale-105 transition-transform cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-atolls-orange">
          {typeof Icon === 'function' ? <Icon className="w-8 h-8" /> : Icon}
        </div>
      </div>
      
      <div className="text-4xl font-bold text-gray-900 mb-1">
        {value?.toLocaleString('de-DE') || 0}
      </div>
      
      <div className="text-sm font-medium text-gray-600 mb-1">
        {title}
      </div>
      
      {subtitle && (
        <div className="text-xs text-gray-500 font-semibold">
          {subtitle}
        </div>
      )}
    </div>
  )
}
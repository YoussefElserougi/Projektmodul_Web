export default function StatCard({ title, value, subtitle, icon: Icon, color = 'bg-surface border-border' }) {
  return (
    <div className={`${color} p-6 rounded-2xl shadow-lg border hover:scale-105 transition-transform cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-cta-secondary">
          {Icon && <Icon className="w-8 h-8" />}
        </div>
      </div>
      
      <div className="text-4xl font-bold text-fg mb-1">
        {value?.toLocaleString('en-US') || 0}
      </div>
      
      <div className="text-sm font-medium text-muted mb-1">
        {title}
      </div>
      
      {subtitle && (
        <div className="text-xs text-muted font-semibold">
          {subtitle}
        </div>
      )}
    </div>
  )
}
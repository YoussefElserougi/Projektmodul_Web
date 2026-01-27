'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function TopicDistributionChart({ keywords }) {
  // Fallback if no data
  if (!keywords || keywords.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted">
        <p>No topic data available</p>
      </div>
    )
  }

  const topKeywords = keywords.slice(0, 5)
  const chartData = topKeywords.map(keyword => ({
    name: keyword.keyword,
    value: keyword.count
  }))

  const COLORS = ['#FF6B35', '#F7931E', '#FDC830', '#F37335', '#C9190B']

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.18)',
            color: '#000000'
          }}
          formatter={(value, name) => [`${value} mentions`, name]}
        />
        <Legend wrapperStyle={{ fontSize: '13px' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

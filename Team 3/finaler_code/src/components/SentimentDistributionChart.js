'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function SentimentDistributionChart({ sentimentBreakdown }) {
  // Fallback if no data
  if (!sentimentBreakdown) {
    return (
      <div className="h-64 flex items-center justify-center text-muted">
        <p>No sentiment data available</p>
      </div>
    )
  }

  const { positive = 0, neutral = 0, negative = 0 } = sentimentBreakdown

  const chartData = [
    { name: 'Positive', value: positive },
    { name: 'Neutral', value: neutral },
    { name: 'Negative', value: negative }
  ]

  const COLORS = ['#10b981', '#f59e0b', '#ef4444']

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent === 0) return null

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
          formatter={(value, name) => [`${value} reviews`, name]}
        />
        <Legend wrapperStyle={{ fontSize: '13px' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

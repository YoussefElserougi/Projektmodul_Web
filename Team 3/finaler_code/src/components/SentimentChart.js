'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function SentimentChart({ data }) {
  // Fallback if no data
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted">
        <p>No trend data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="date" 
          stroke="var(--muted)"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="var(--muted)"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.18)',
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '14px', fontWeight: '600' }}
        />
        <Line 
          type="monotone" 
          dataKey="positive" 
          stroke="#10b981" 
          strokeWidth={3}
          name="Positive"
          dot={{ fill: '#10b981', r: 5 }}
          activeDot={{ r: 7 }}
        />
        <Line 
          type="monotone" 
          dataKey="neutral" 
          stroke="#f59e0b" 
          strokeWidth={3}
          name="Neutral"
          dot={{ fill: '#f59e0b', r: 5 }}
          activeDot={{ r: 7 }}
        />
        <Line 
          type="monotone" 
          dataKey="negative" 
          stroke="#ef4444" 
          strokeWidth={3}
          name="Negative"
          dot={{ fill: '#ef4444', r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function SentimentChart({ data }) {
  // Fallback wenn keine Daten
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <p>Keine Trend-Daten verfügbar</p>
      </div>
    )
  }

  // Beispiel Datenformat von n8n:
  // [ { date: "2024-12-01", positive: 5, neutral: 3, negative: 2 } ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
          name="Positiv"
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
          name="Negativ"
          dot={{ fill: '#ef4444', r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
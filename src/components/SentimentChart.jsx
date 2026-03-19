import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { EMOTION_COLORS } from '../utils/sentiment.js'

export default function SentimentChart({ avgEmotions }) {
  return (
    <div className="chart-section">
      <p className="section-label">— emotion distribution</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={avgEmotions} layout="vertical">
          <XAxis type="number" domain={[0, 1]} stroke="#333"
            tick={{ fill: '#555', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickFormatter={v => `${Math.round(v * 100)}%`} />
          <YAxis type="category" dataKey="label" stroke="#333" width={110}
            tick={{ fill: '#888', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
          <Tooltip
            contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '2px', fontFamily: 'JetBrains Mono', fontSize: 12 }}
            formatter={v => [`${Math.round(v * 100)}%`]}
            labelStyle={{ color: '#aaa' }}
          />
          <Bar dataKey="score" radius={[0, 2, 2, 0]}>
            {avgEmotions.map(entry => (
              <Cell key={entry.label} fill={EMOTION_COLORS[entry.label] || '#555'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
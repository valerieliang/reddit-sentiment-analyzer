import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { EMOTION_COLORS } from '../utils/sentiment.js'

export default function SentimentChart({ avgEmotions }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ color: '#aaa', marginBottom: '1rem' }}>Average emotion scores</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={avgEmotions} layout="vertical">
          <XAxis type="number" domain={[0, 1]} stroke="#555"
            tickFormatter={v => `${Math.round(v * 100)}%`} />
          <YAxis type="category" dataKey="label" stroke="#555" width={100} />
          <Tooltip
            contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }}
            formatter={v => `${Math.round(v * 100)}%`}
          />
          <Bar dataKey="score" radius={[0, 6, 6, 0]}>
            {avgEmotions.map(entry => (
              <Cell key={entry.label} fill={EMOTION_COLORS[entry.label] || '#9e9e9e'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
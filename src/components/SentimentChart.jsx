import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = { positive: '#4caf50', neutral: '#9e9e9e', negative: '#f44336' }

export default function SentimentChart({ counts }) {
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }))
  return (
    <div style={{ marginBottom: '2rem' }}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
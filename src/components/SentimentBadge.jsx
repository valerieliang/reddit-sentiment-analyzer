import React from 'react'

const colors = {
  positive: { bg: '#1a3a1a', text: '#4caf50' },
  negative: { bg: '#3a1a1a', text: '#f44336' },
  neutral:  { bg: '#2a2a2a', text: '#9e9e9e' },
}

export default function SentimentBadge({ label }) {
  const { bg, text } = colors[label] || colors.neutral
  return (
    <span style={{ background: bg, color: text, padding: '2px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
      {label}
    </span>
  )
}
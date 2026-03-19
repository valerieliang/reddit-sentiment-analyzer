import React from 'react'
import { EMOTION_COLORS, EMOTION_EMOJI } from '../utils/sentiment.js'

export default function SummaryPanel({ stats, summary, postCount }) {
  const top = stats.topEmotion
  const color = EMOTION_COLORS[top] || '#9e9e9e'
  const emoji = EMOTION_EMOJI[top] || '😐'

  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '2rem' }}>{emoji}</span>
        <div>
          <h2 style={{ color, margin: 0, textTransform: 'capitalize' }}>{top}</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '0.85rem' }}>dominant emotion across {postCount} posts</p>
        </div>
      </div>

      {summary && (
        <div style={{ background: '#111', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', borderLeft: `3px solid ${color}` }}>
          <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
            {summary}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {Object.entries(stats.dominantCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([label, count]) => (
            <span key={label} style={{
              background: (EMOTION_COLORS[label] || '#9e9e9e') + '22',
              color: EMOTION_COLORS[label] || '#9e9e9e',
              border: `1px solid ${(EMOTION_COLORS[label] || '#9e9e9e')}44`,
              borderRadius: '999px',
              padding: '2px 10px',
              fontSize: '0.8rem',
            }}>
              {EMOTION_EMOJI[label]} {label} {count}
            </span>
          ))}
      </div>
    </div>
  )
}
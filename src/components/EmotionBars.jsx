import React from 'react'
import { EMOTION_COLORS, EMOTION_EMOJI } from '../utils/sentiment.js'

export default function EmotionBars({ avgEmotions }) {
  const max = avgEmotions[0]?.score || 1

  return (
    <div className="bars-card">
      <div className="summary-label" style={{ marginBottom: '1rem' }}>emotion breakdown</div>
      {avgEmotions.map(e => (
        <div className="bar-row" key={e.label}>
          <div className="bar-name">{EMOTION_EMOJI[e.label]} {e.label}</div>
          <div className="bar-track">
            <div className="bar-fill"
              style={{ width: `${(e.score / max) * 100}%`, background: EMOTION_COLORS[e.label] || '#555' }} />
          </div>
          <div className="bar-pct">{Math.round(e.score * 100)}%</div>
        </div>
      ))}
    </div>
  )
}
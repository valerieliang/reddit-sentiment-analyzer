import React from 'react'
import { EMOTION_COLORS, EMOTION_EMOJI } from '../utils/sentiment.js'

export default function SummaryCard({ stats, summary, postCount }) {
  const top   = stats.topEmotion
  const color = EMOTION_COLORS[top] || '#888'
  const emoji = EMOTION_EMOJI[top]  || '😐'

  const positive = Object.entries(stats.dominantCounts)
    .filter(([l]) => ['joy','admiration','approval','gratitude','love','optimism','excitement','amusement','relief','pride','caring'].includes(l))
    .reduce((s, [, n]) => s + n, 0)

  const negative = Object.entries(stats.dominantCounts)
    .filter(([l]) => ['anger','annoyance','disappointment','disapproval','disgust','fear','grief','remorse','sadness','nervousness','embarrassment'].includes(l))
    .reduce((s, [, n]) => s + n, 0)

  const neutral = postCount - positive - negative

  return (
    <div className="summary-card">
      <div className="top-emotion">
        <span className="emotion-emoji">{emoji}</span>
        <div>
          <div className="emotion-name" style={{ color }}>{top}</div>
          <div className="emotion-caption">dominant · {postCount} posts</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-cell">
          <div className="stat-num" style={{ color: '#6ee7b7' }}>{positive}</div>
          <div className="stat-label">positive</div>
        </div>
        <div className="stat-cell">
          <div className="stat-num" style={{ color: '#94a3b8' }}>{neutral}</div>
          <div className="stat-label">neutral</div>
        </div>
        <div className="stat-cell">
          <div className="stat-num" style={{ color: '#f87171' }}>{negative}</div>
          <div className="stat-label">negative</div>
        </div>
        <div className="stat-cell">
          <div className="stat-num">{postCount}</div>
          <div className="stat-label">total</div>
        </div>
      </div>

      {summary && (
        <div className="summary-quote">
          <div className="summary-label">summary</div>
          {summary}
        </div>
      )}
    </div>
  )
}
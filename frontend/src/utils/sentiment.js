export const EMOTION_COLORS = {
  joy:      '#f7c948',
  anger:    '#f44336',
  sadness:  '#5c9bd6',
  fear:     '#9c27b0',
  surprise: '#ff9800',
  disgust:  '#8bc34a',
  neutral:  '#9e9e9e',
}

// Given analyzed posts, compute aggregate emotion averages
export function getSummaryStats(posts) {
  const totals = {}
  const dominantCounts = {}

  for (const post of posts) {
    const top = post.emotions[0].label  // highest scoring emotion
    dominantCounts[top] = (dominantCounts[top] || 0) + 1

    for (const { label, score } of post.emotions) {
      totals[label] = (totals[label] || 0) + score
    }
  }

  const avgEmotions = Object.entries(totals).map(([label, total]) => ({
    label,
    score: parseFloat((total / posts.length).toFixed(3)),
  })).sort((a, b) => b.score - a.score)

  return {
    avgEmotions,
    dominantCounts,
    topEmotion: avgEmotions[0]?.label ?? 'neutral',
  }
}
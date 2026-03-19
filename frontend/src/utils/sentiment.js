export const EMOTION_COLORS = {
  admiration: '#f7c948', amusement: '#ff9800', anger: '#f44336',
  annoyance: '#e57373', approval: '#4caf50', caring: '#e91e63',
  confusion: '#9c27b0', curiosity: '#00bcd4', desire: '#ff5722',
  disappointment: '#795548', disapproval: '#f44336', disgust: '#8bc34a',
  embarrassment: '#ff80ab', excitement: '#ffeb3b', fear: '#673ab7',
  gratitude: '#4caf50', grief: '#607d8b', joy: '#ffeb3b',
  love: '#e91e63', nervousness: '#9c27b0', optimism: '#8bc34a',
  pride: '#ff9800', realization: '#00bcd4', relief: '#4caf50',
  remorse: '#795548', sadness: '#5c9bd6', surprise: '#ff9800',
  neutral: '#9e9e9e',
}

export const EMOTION_EMOJI = {
  admiration: '🤩', amusement: '😄', anger: '😠', annoyance: '😤',
  approval: '👍', caring: '🤗', confusion: '😕', curiosity: '🤔',
  desire: '😍', disappointment: '😞', disapproval: '👎', disgust: '🤢',
  embarrassment: '😳', excitement: '🤩', fear: '😨', gratitude: '🙏',
  grief: '😢', joy: '😊', love: '❤️', nervousness: '😬',
  optimism: '🌟', pride: '😌', realization: '💡', relief: '😅',
  remorse: '😔', sadness: '😢', surprise: '😲', neutral: '😐',
}

export function getSummaryStats(posts) {
  const counts = {}
  const totals = {}

  for (const post of posts) {
    const top = post.emotions[0].label
    counts[top] = (counts[top] || 0) + 1

    for (const { label, score } of post.emotions) {
      totals[label] = (totals[label] || 0) + score
    }
  }

  const avgEmotions = Object.entries(totals)
    .map(([label, total]) => ({
      label,
      score: parseFloat((total / posts.length).toFixed(3)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)

  return {
    avgEmotions,
    dominantCounts: counts,
    topEmotion: avgEmotions[0]?.label ?? 'neutral',
  }
}
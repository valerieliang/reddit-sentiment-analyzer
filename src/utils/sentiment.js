import Sentiment from 'sentiment'

const analyzer = new Sentiment()

export function analyzePosts(posts) {
  return posts.map((post) => {
    const result = analyzer.analyze(`${post.title} ${post.text}`)
    const label =
      result.score > 0 ? 'positive'
      : result.score < 0 ? 'negative'
      : 'neutral'
    return { ...post, sentimentScore: result.score, comparative: result.comparative, label }
  })
}

export function getSummaryStats(posts) {
  const counts = { positive: 0, negative: 0, neutral: 0 }
  let totalComparative = 0

  for (const p of posts) {
    counts[p.label]++
    totalComparative += p.comparative
  }

  const avg = totalComparative / posts.length
  const overall =
    counts.positive > counts.negative ? 'Mostly Positive'
    : counts.negative > counts.positive ? 'Mostly Negative'
    : 'Mixed / Neutral'

  return { counts, avgScore: avg.toFixed(3), overall }
}
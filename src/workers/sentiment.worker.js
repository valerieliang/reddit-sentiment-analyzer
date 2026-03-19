import { pipeline, env } from '@huggingface/transformers'

// Use CDN, don't try to load locally
env.allowLocalModels = false

let classifier = null

self.onmessage = async (e) => {
  const { type, payload } = e.data

  if (type === 'LOAD_MODEL') {
    try {
      self.postMessage({ type: 'MODEL_LOADING', progress: 0 })
      classifier = await pipeline(
        'text-classification',
        'j-hartmann/emotion-english-distilroberta-base',
        {
          progress_callback: (p) => {
            if (p.status === 'downloading') {
              const pct = Math.round((p.loaded / p.total) * 100)
              self.postMessage({ type: 'MODEL_LOADING', progress: pct })
            }
          },
        }
      )
      self.postMessage({ type: 'MODEL_READY' })
    } catch (err) {
      self.postMessage({ type: 'MODEL_ERROR', error: err.message })
    }
  }

  if (type === 'ANALYZE') {
    const { posts } = payload
    const results = []

    for (let i = 0; i < posts.length; i++) {
      const text = `${posts[i].title} ${posts[i].text}`.slice(0, 512)
      const [result] = await classifier(text, { topk: 7 })
      results.push({ ...posts[i], emotions: result })
      self.postMessage({ type: 'PROGRESS', current: i + 1, total: posts.length })
    }

    self.postMessage({ type: 'DONE', results })
  }
}
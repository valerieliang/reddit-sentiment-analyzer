import React from 'react'

export default function ModelLoader({ progress, ready }) {
  if (ready) return null

  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
      <p style={{ marginBottom: '0.75rem' }}>
        {progress === 0 ? 'Loading emotion model...' : `Downloading model: ${progress}%`}
      </p>
      <div style={{ background: '#2a2a2a', borderRadius: '999px', height: '8px', width: '300px', margin: '0 auto' }}>
        <div style={{
          background: '#ff6314',
          height: '100%',
          borderRadius: '999px',
          width: `${progress}%`,
          transition: 'width 0.3s ease'
        }} />
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#555' }}>
        First load only — cached after this
      </p>
    </div>
  )
}
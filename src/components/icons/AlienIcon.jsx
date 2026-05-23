import React from 'react'

export default function AlienIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 8" fill={color} style={{ imageRendering: 'pixelated' }}>
      <path d="M3,0 h5 v1 h-5 z M2,1 h7 v1 h-7 z M1,2 h9 v1 h-9 z M0,3 h3 v1 h-3 z M4,3 h3 v1 h-3 z M8,3 h3 v1 h-3 z M0,4 h11 v1 h-11 z M0,5 h1 v1 h-1 z M2,5 h7 v1 h-7 z M10,5 h1 v1 h-1 z M0,6 h1 v1 h-1 z M2,6 h1 v1 h-1 z M8,6 h1 v1 h-1 z M10,6 h1 v1 h-1 z M3,7 h2 v1 h-2 z M6,7 h2 v1 h-2 z" />
    </svg>
  )
}

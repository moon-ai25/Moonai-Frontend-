import React from 'react'

const variants = {
  purple: { background: 'rgba(124,58,237,0.18)', color: 'var(--primary-color)', border: '1px solid rgba(124,58,237,0.3)' },
  emerald: { background: 'rgba(16,185,129,0.15)', color: 'var(--accent-emerald)', border: '1px solid rgba(16,185,129,0.25)' },
  cyan: { background: 'rgba(6,182,212,0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(6,182,212,0.25)' },
  red: { background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.25)' },
}

export default function Badge({ children, variant = 'purple', style = {} }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: '999px',
        fontSize: 11,
        fontWeight: 500,
        fontFamily: 'var(--font-body)',
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
}

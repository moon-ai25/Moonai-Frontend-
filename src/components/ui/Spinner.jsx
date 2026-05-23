import React from 'react'
import { motion } from 'framer-motion'

export default function Spinner({ size = 20, color = 'var(--primary-color)' }) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        border: `2px solid rgba(139,92,246,0.2)`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        flexShrink: 0,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  )
}

import React from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import shapeSpinner from '../../assets/shape_spinner.json'

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 10,
        padding: '4px 0 12px',
        maxWidth: 700,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
          Moon AI
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 12px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px 18px 18px 4px',
            width: 'fit-content'
          }}
        >
          <Lottie 
            animationData={shapeSpinner} 
            loop={true} 
            style={{ width: 40, height: 24 }} 
          />
        </div>
      </div>
    </motion.div>
  )
}

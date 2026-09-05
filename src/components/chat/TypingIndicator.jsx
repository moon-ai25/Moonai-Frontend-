import React from 'react'
import { motion } from 'framer-motion'

export default function TypingIndicator() {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -4 }
  }

  const transition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut'
  }

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
            gap: '4px',
            padding: '10px 14px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px 18px 18px 4px',
            width: 'fit-content',
            height: '36px'
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{ ...transition, delay: i * 0.15 }}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--primary-color)'
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

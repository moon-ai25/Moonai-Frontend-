import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Tooltip({ children, label, placement = 'top' }) {
  const [show, setShow] = useState(false)

  const positions = {
    top: { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    left: { right: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' },
    right: { left: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' },
  }

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              ...positions[placement],
              background: 'rgba(22,22,42,0.95)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)',
              fontSize: 12,
              fontFamily: 'var(--font-body)',
              whiteSpace: 'nowrap',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              pointerEvents: 'none',
              zIndex: 1000,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

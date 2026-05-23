import React from 'react'
import { motion } from 'framer-motion'
import Tooltip from '../ui/Tooltip'

const AttachIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" fill="currentColor">
    <path d="M31.7582,93.0634 A17.9879,17.9879,0,0,1,19.0319,62.3493 L44.4845,36.8967 A5.9992,5.9992,0,0,1,52.9686,45.3809 L27.5161,70.8334 A5.9992,5.9992,0,1,0,36,79.3176 L69.937,45.3809 A17.993,17.993,0,0,0,69.937,19.9284 A18.4232,18.4232,0,0,0,44.4845,19.9284 L19.0319,45.3809 A5.9992,5.9992,0,1,1,10.5478,36.8967 L36,11.4442 C47.3555,0.1008 67.1128,0.1008 78.4211,11.4442 A29.9883,29.9883,0,0,1,78.4211,53.8651 L44.4845,87.8018 A17.9584,17.9584,0,0,1,31.7582,93.0634 Z"/>
  </svg>
)

export default function AttachmentButton({ onClick }) {
  return (
    <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={onClick}
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'transparent',
          border: '1px solid transparent',
          cursor: 'pointer',
          color: 'var(--text-tertiary)',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
      >
        <AttachIcon size={20} />
      </motion.button>
  )
}

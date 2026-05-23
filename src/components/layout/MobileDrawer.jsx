import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Sidebar from '../sidebar/Sidebar'
import useChatStore from '../../store/chatStore'

export default function MobileDrawer() {
  const { isSidebarOpen, setSidebarOpen } = useChatStore()
  const overlayRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setSidebarOpen])

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              background: 'rgba(10,10,15,0.7)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              width: 280,
              zIndex: 301,
              boxShadow: '4px 0 40px rgba(0,0,0,0.5)',
            }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: -44,
                zIndex: 302,
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
            <Sidebar isOpen={true} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

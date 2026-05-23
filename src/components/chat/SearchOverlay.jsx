import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronUp, ChevronDown, Search } from 'lucide-react'
import useSearch from '../../hooks/useSearch'
import { searchOverlayEntrance } from '../../animations/gsapPresets'

export default function SearchOverlay() {
  const { searchQuery, searchMatches, searchIndex, closeSearch, search, next, prev } = useSearch()
  const inputRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeSearch()
      if (e.key === 'Enter') e.shiftKey ? prev() : next()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeSearch, next, prev])

  // Scroll active match into view
  useEffect(() => {
    const match = searchMatches[searchIndex]
    if (!match) return
    const el = document.getElementById(`msg-${match.id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [searchIndex, searchMatches])

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: '999px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 8px 32px var(--primary-transparent), 0 2px 10px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px)',
        minWidth: 380,
        maxWidth: '90vw',
      }}
    >
      <Search size={16} color="var(--primary-color)" style={{ flexShrink: 0 }} />

      <input
        ref={inputRef}
        value={searchQuery}
        onChange={(e) => search(e.target.value)}
        placeholder="Search in conversation…"
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontSize: 14,
          fontFamily: 'var(--font-body)',
        }}
      />

      {/* Results counter */}
      {searchQuery && (
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {searchMatches.length > 0
            ? `${searchIndex + 1} of ${searchMatches.length}`
            : 'No matches'}
        </span>
      )}

      {/* Navigation */}
      <button
        onClick={prev}
        disabled={!searchMatches.length}
        style={navBtn}
        title="Previous (Shift+Enter)"
      >
        <ChevronUp size={14} />
      </button>
      <button
        onClick={next}
        disabled={!searchMatches.length}
        style={navBtn}
        title="Next (Enter)"
      >
        <ChevronDown size={14} />
      </button>

      {/* Close */}
      <button onClick={closeSearch} style={{ ...navBtn, color: 'var(--text-tertiary)' }} title="Close (Esc)">
        <X size={14} />
      </button>
    </motion.div>
  )
}

const navBtn = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: 'var(--bg-hover)',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 0.2s, color 0.2s',
}

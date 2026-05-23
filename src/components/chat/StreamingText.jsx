import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StreamingText({ content, isStreaming }) {
  const [displayedWords, setDisplayedWords] = useState([])
  const prevContentRef = useRef('')

  useEffect(() => {
    if (!content) { setDisplayedWords([]); return }

    // If not streaming — show all immediately
    if (!isStreaming) {
      setDisplayedWords(content.split(' ').map((w, i) => ({ word: w, id: i })))
      return
    }

    // Find new words added since last render
    const newPart = content.slice(prevContentRef.current.length)
    prevContentRef.current = content

    if (!newPart) return

    const newWords = newPart.split(' ').filter(Boolean)
    setDisplayedWords((prev) => [
      ...prev,
      ...newWords.map((w, i) => ({ word: w, id: prev.length + i })),
    ])
  }, [content, isStreaming])

  return (
    <span>
      <AnimatePresence initial={false}>
        {displayedWords.map(({ word, id }, idx) => (
          <motion.span
            key={id}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ display: 'inline' }}
          >
            {word}
            {idx < displayedWords.length - 1 || !isStreaming ? ' ' : ''}
          </motion.span>
        ))}
      </AnimatePresence>
      {isStreaming && (
        <span className="blink-cursor" style={{ color: 'var(--primary-color)', marginLeft: 1 }}>
          ▋
        </span>
      )}
    </span>
  )
}

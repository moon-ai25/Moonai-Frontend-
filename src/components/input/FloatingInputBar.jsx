import React, { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Square, X, PenLine, GraduationCap, Code, Coffee, Lightbulb, Camera, Image as ImageIcon, Globe, Terminal, SpellCheck, Pencil } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import useChat from '../../hooks/useChat'
import useChatStore from '../../store/chatStore'
import VoiceButton from './VoiceButton'
import AttachmentButton from './AttachmentButton'
import RichTextInput from './RichTextInput'
import FilePreview from '../chat/FilePreview'
import { htmlToMarkdown } from '../../utils/htmlToMarkdown'
import { estimateTokens, tokenColor } from '../../utils/markdown'
import { buildMessageContent } from '../../utils/fileHelpers'

const CATEGORIES = [
  {
    id: 'write',
    label: 'Write',
    icon: PenLine,
    suggestions: [
      'Create persuasive arguments',
      'Draft email newsletters',
      'Draft an outline for my project',
      'Develop instructional content',
      'Write video scripts'
    ]
  },
  {
    id: 'learn',
    label: 'Learn',
    icon: GraduationCap,
    suggestions: [
      'Develop critical analyses',
      'Create feedback for student work',
      'Develop concept maps',
      'Design a lesson or curriculum',
      'Design presentation visuals'
    ]
  },
  {
    id: 'code',
    label: 'Code',
    icon: Code,
    suggestions: [
      'Refactor this function',
      'Write unit tests for a React component',
      'Explain this regex',
      'Help me debug a CSS issue',
      'Convert this snippet to TypeScript'
    ]
  },
  {
    id: 'life',
    label: 'Life stuff',
    icon: Coffee,
    suggestions: [
      'Plan a 3-day trip to Tokyo',
      'Recommend a healthy meal plan',
      'Help me write a workout routine',
      'Summarize this long email',
      'Draft a polite decline for a meeting'
    ]
  },
  {
    id: 'choice',
    label: "Moon's choice",
    icon: Lightbulb,
    suggestions: [
      'Tell me a philosophical joke',
      'Explain quantum entanglement like I am five',
      'Give me a creative writing prompt',
      'Suggest a new skill to learn',
      'Tell me a fun fact about space'
    ]
  }
]

import { fixGrammar, enhancePrompt } from '../../api/moonai'

export default function FloatingInputBar({ onSendSuggestion }) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false)
  const [isWebSearchActive, setIsWebSearchActive] = useState(false)
  const [isToolLoading, setIsToolLoading] = useState(false)
  
  const textareaRef = useRef(null)
  const { sendMessage, stopGeneration, isGenerating } = useChat()
  const { messages, isSidebarOpen, isTempChat } = useChatStore()

  const isEmpty = messages.length === 0


  // Close suggestions when conversation starts
  useEffect(() => {
    if (!isEmpty) setActiveCategory(null)
  }, [isEmpty])

  const handleSend = useCallback(async (text) => {
    // If text is a suggestion, it's already plain text/markdown. If it's the input, it's HTML.
    const rawContent = typeof text === 'string' ? text : input
    const sendText = htmlToMarkdown(rawContent)

    if (!sendText.trim() && !attachments.length) return
    if (isGenerating || isToolLoading) return

    setInput('')
    setAttachments([])
    setActiveCategory(null)
    
    // Auto-disable web search after one use? Optional. We will leave it as a persistent mode.
    await sendMessage(sendText, attachments, isWebSearchActive)
  }, [input, attachments, isGenerating, isToolLoading, isWebSearchActive, sendMessage])

  const handleGrammar = async () => {
    setIsAttachMenuOpen(false)
    const text = htmlToMarkdown(input).trim()
    if (!text) return toast.error('Please enter some text first')
    setIsToolLoading(true)
    try {
      const res = await fixGrammar(text)
      setInput(res.corrected || text)
      toast.success('Grammar improved')
    } catch (e) {
      toast.error('Failed to fix grammar')
    } finally {
      setIsToolLoading(false)
    }
  }

  const handlePrompt = async () => {
    setIsAttachMenuOpen(false)
    const text = htmlToMarkdown(input).trim()
    if (!text) return toast.error('Please enter some text first')
    setIsToolLoading(true)
    try {
      const res = await enhancePrompt(text)
      setInput(res.enhanced || text)
      toast.success('Prompt enhanced')
    } catch (e) {
      toast.error('Failed to enhance prompt')
    } finally {
      setIsToolLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFilesAdded = useCallback((files) => {
    // 1. Reject non-image files
    const validFiles = files.filter(f => f.type.startsWith('image/'))
    if (validFiles.length !== files.length) {
      toast.error('Only image files are allowed.')
    }
    
    if (validFiles.length === 0) return

    // 2. Enforce 4 images per conversation limit
    const existingImagesCount = messages.reduce((count, msg) => {
      if (msg.role === 'user') {
        const matches = msg.content.match(/!\[Uploaded Image\]/g)
        return count + (matches ? matches.length : 0)
      }
      return count
    }, 0)

    if (existingImagesCount + attachments.length + validFiles.length > 4) {
      toast.error('You can only upload up to 4 images per conversation.')
      return
    }

    setAttachments((prev) => [...prev, ...validFiles])
  }, [messages, attachments.length])

  const handlePaste = useCallback((e) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      const filesArray = Array.from(e.clipboardData.files)
      const imageFiles = filesArray.filter(f => f.type.startsWith('image/'))
      if (imageFiles.length > 0) {
        e.preventDefault()
        handleFilesAdded(imageFiles)
      }
    }
  }, [handleFilesAdded])

  const { getRootProps, getInputProps, isDragActive, open: openDropzone } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: handleFilesAdded,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
  })

  const handleRemoveFile = useCallback((index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleTranscript = useCallback((text) => {
    setInput((prev) => prev + (prev ? ' ' : '') + text)
    textareaRef.current?.focus()
  }, [])

  const handleSuggestionClick = useCallback((s) => {
    onSendSuggestion?.(s) || handleSend(s)
  }, [onSendSuggestion, handleSend])

  const canSend = (input.trim().length > 0 || attachments.length > 0) && !isGenerating
  const hasNewLine = input.includes('\n') || input.length > 60

  return (
    <motion.div
      id="floating-input-bar"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        bottom: 0
      }}
      transition={{
        bottom: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.5 }
      }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        padding: '24px 16px 24px',
        background: 'linear-gradient(to top, var(--bg-primary) 60%, transparent)',
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: isSidebarOpen ? 800 : 880,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          transition: 'max-width 0.3s ease',
        }}
      >
        {/* File previews on top of the input bar */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <FilePreview files={attachments} onRemove={handleRemoveFile} />
          )}
        </AnimatePresence>

        {/* Suggestions — only shown on empty/welcome screen when no text is typed */}
        {isEmpty && !input.trim() && (
          <>
            {/* Expanded suggestion list — appears above input */}
            <AnimatePresence mode="wait">
              {activeCategory && (
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-medium)',
                    overflow: 'hidden',
                    textAlign: 'left',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>
                      <activeCategory.icon size={13} />
                      {activeCategory.label}
                    </div>
                    <button
                      onClick={() => setActiveCategory(null)}
                      style={{ color: 'var(--text-tertiary)', padding: 4, borderRadius: 4, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {activeCategory.suggestions.map((s, idx) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestionClick(s)}
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: 13.5,
                          color: 'var(--primary-color)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          borderBottom: idx === activeCategory.suggestions.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                          transition: 'background 0.15s',
                          fontFamily: 'var(--font-body)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory?.id === cat.id ? null : cat)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '7px 13px',
                    border: '1px solid',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 12.5,
                    fontWeight: 500,
                    fontFamily: 'var(--font-body)',
                    color: activeCategory?.id === cat.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                    borderColor: activeCategory?.id === cat.id ? 'var(--primary-color)' : 'var(--border-subtle)',
                    background: activeCategory?.id === cat.id ? 'var(--primary-transparent)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <cat.icon size={13} />
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </>
        )}

        {/* Dynamic Input Container */}
        <div style={{ position: 'relative', display: 'flex', gap: 12, alignItems: 'flex-end', width: '100%' }}>
          
          {/* Attach Menu Popover */}
          <AnimatePresence>
            {isAttachMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  right: 64,
                  marginBottom: 12,
                  background: 'var(--bg-elevated)',
                  borderRadius: 24,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  border: '1px solid var(--border-medium)',
                  boxShadow: 'var(--shadow-card)',
                  zIndex: 50,
                  width: '100%',
                  maxWidth: 400,
                }}
              >
                <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => { setIsAttachMenuOpen(false); openDropzone(); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'var(--bg-secondary)', borderRadius: 16, border: 'none', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      <ImageIcon size={16} /> Photo
                    </button>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', marginTop: -6, marginBottom: 2 }}>
                    Text Extraction only
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => { setIsWebSearchActive(p => !p); setIsAttachMenuOpen(false); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: isWebSearchActive ? 'rgba(234, 179, 8, 0.15)' : 'var(--bg-secondary)', borderRadius: 16, border: isWebSearchActive ? '1px solid #eab308' : 'none', color: '#eab308', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    <Globe size={16} /> Web {isWebSearchActive && ' (On)'}
                  </button>
                  <button onClick={handlePrompt} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'var(--bg-secondary)', borderRadius: 16, border: 'none', color: '#a855f7', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    <Terminal size={16} /> Prompt
                  </button>
                  <button onClick={handleGrammar} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'var(--bg-secondary)', borderRadius: 16, border: 'none', color: '#3b82f6', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    <Pencil size={16} /> Grammar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Pill */}
          <motion.div
            layout
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              flex: 1,
              background: 'var(--bg-elevated)',
              borderRadius: 28,
              padding: '8px 16px',
              display: 'flex',
              flexWrap: 'nowrap',
              alignItems: 'flex-end',
              gap: 12,
              border: isDragActive ? '1px solid var(--primary-color)' : '1px solid var(--border-subtle)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 52,
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />

            {/* Local Dropzone Overlay */}
            <AnimatePresence>
              {isDragActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 20,
                    background: 'var(--bg-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    backdropFilter: 'blur(8px)',
                    color: 'var(--primary-color)',
                  }}
                >
                  <div style={{ padding: 6, background: 'var(--primary-transparent)', borderRadius: '50%', display: 'flex' }}>
                    <ArrowUp size={20} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                    Drop to attach files
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center: Textarea */}
            <motion.div layout transition={{ duration: 0.15 }} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <RichTextInput
                ref={textareaRef}
                value={input}
                onChange={setInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={isTempChat ? "Private chat" : "Ask anything"}
                disabled={isGenerating}
              />
            </motion.div>

            {/* Right inside pill: Attach */}
            <motion.div layout transition={{ duration: 0.15 }} style={{ display: 'flex', alignItems: 'center' }}>
              <AttachmentButton onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)} />
            </motion.div>
          </motion.div>

          {/* Outside Right: Voice or Send */}
          <motion.div layout transition={{ duration: 0.15 }} style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            paddingBottom: hasNewLine ? 4 : 0,
          }}>
            {input.trim() || isGenerating ? (
              <motion.button
                id="send-btn"
                onClick={isGenerating ? stopGeneration : handleSend}
                disabled={!isGenerating && !canSend}
                whileHover={canSend || isGenerating ? { scale: 1.05 } : {}}
                whileTap={canSend || isGenerating ? { scale: 0.95 } : {}}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: isGenerating ? 'var(--primary-color)' : canSend ? 'var(--primary-color)' : 'var(--bg-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canSend || isGenerating ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s, opacity 0.2s',
                  color: 'var(--bg-primary)',
                  opacity: !isGenerating && !canSend ? 0.5 : 1,
                  border: 'none',
                }}
              >
                {isGenerating ? (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                  >
                    <Square size={16} fill="currentColor" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <ArrowUp size={20} strokeWidth={2.5} />
                )}
              </motion.button>
            ) : (
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'var(--primary-color)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <VoiceButton onTranscript={handleTranscript} />
              </div>
            )}
          </motion.div>
        </div>

        {/* Disclaimer */}
        <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.4, fontSize: 11, marginTop: 8, color: 'var(--text-tertiary)' }}>
          <span>Even in orbit, errors happen. Confirm key informations.</span>
        </div>
      </div>
    </motion.div>
  )
}

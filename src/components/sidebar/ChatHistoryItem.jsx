import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreHorizontal, Pencil, Trash2, Share2, Check, X } from 'lucide-react'
import { renameChat, deleteChat, shareChat } from '../../api/moonai'
import useChatStore from '../../store/chatStore'
import toast from 'react-hot-toast'

export default function ChatHistoryItem({ chat, isActive, onClick, username }) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameVal, setRenameVal] = useState(chat.title)
  const [showDot, setShowDot] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const menuRef = useRef(null)
  const { removeChatFromList, renameChatInList, newChat } = useChatStore()

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
        setIsDeleting(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleRename = async () => {
    if (!renameVal.trim() || renameVal === chat.title) {
      setIsRenaming(false)
      setRenameVal(chat.title)
      return
    }
    try {
      await renameChat(username, chat.title, renameVal.trim())
      renameChatInList(chat.title, renameVal.trim())
      toast.success('Chat renamed')
    } catch {
      toast.error('Failed to rename chat')
      setRenameVal(chat.title)
    }
    setIsRenaming(false)
  }

  const handleDelete = async () => {
    try {
      await deleteChat(username, chat.title)
      removeChatFromList(chat.title)
      newChat()
      toast.success('Chat deleted')
    } catch {
      toast.error('Failed to delete chat')
    }
    setMenuOpen(false)
    setIsDeleting(false)
  }

  const handleShare = async () => {
    try {
      const data = await shareChat(username, chat.title)
      const link = `https://moon-ai.info/shared/${data.shareId}`
      await navigator.clipboard.writeText(link)
      toast.success('Share link copied! 🔗')
    } catch {
      toast.error('Failed to share chat')
    }
    setMenuOpen(false)
  }

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setShowDot(true)}
      onMouseLeave={() => { if (!menuOpen) setShowDot(false) }}
    >
      <motion.div
        layout
        onClick={() => !isRenaming && onClick(chat)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '9px 12px',
          borderRadius: 8,
          cursor: 'pointer',
          background: isActive ? 'var(--bg-elevated)' : 'transparent',
          transition: 'background 0.2s',
          minHeight: 38,
          margin: '1px 6px',
        }}
        whileHover={{ background: isActive ? 'var(--bg-elevated)' : 'var(--bg-hover)' }}
      >
        {isRenaming ? (
          <div style={{ display: 'flex', flex: 1, gap: 6, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={renameVal}
              onChange={(e) => setRenameVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename()
                if (e.key === 'Escape') { setIsRenaming(false); setRenameVal(chat.title) }
              }}
              style={{
                flex: 1,
                background: 'var(--bg-primary)',
                border: '1px solid var(--primary-color)',
                borderRadius: 6,
                padding: '4px 8px',
                color: 'var(--text-primary)',
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                outline: 'none',
              }}
            />
            <button onClick={handleRename} style={{ color: 'var(--primary-color)', display: 'flex', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Check size={14} />
            </button>
            <button onClick={() => { setIsRenaming(false); setRenameVal(chat.title) }} style={{ color: 'var(--text-tertiary)', display: 'flex', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            {/* Title */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{
                fontSize: 13.5,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: isActive ? 500 : 400,
              }}>
                {chat.title}
              </div>
            </div>

            {/* 3-dot button — visible on hover */}
            <AnimatePresence>
              {(showDot || menuOpen) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.1 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen((v) => !v)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: menuOpen ? 'var(--bg-hover)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                    flexShrink: 0,
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = menuOpen ? 'var(--bg-hover)' : 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                >
                  <MoreHorizontal size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.13 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              right: 10,
              top: '100%',
              zIndex: 200,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              minWidth: 150,
              overflow: 'hidden',
              padding: '4px',
            }}
          >
            {isDeleting ? (
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Delete this chat?</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={handleDelete}
                    style={{ flex: 1, padding: '5px 0', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#f87171', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setIsDeleting(false)}
                    style={{ flex: 1, padding: '5px 0', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 6, color: 'var(--text-tertiary)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <MenuItem
                  icon={<Pencil size={13} />}
                  label="Rename"
                  onClick={() => { setMenuOpen(false); setIsRenaming(true) }}
                />
                <MenuItem
                  icon={<Share2 size={13} />}
                  label="Share"
                  onClick={handleShare}
                />
                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
                <MenuItem
                  icon={<Trash2 size={13} />}
                  label="Delete"
                  onClick={() => setIsDeleting(true)}
                  danger
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        width: '100%',
        padding: '8px 10px',
        background: 'transparent',
        border: 'none',
        borderRadius: 7,
        cursor: 'pointer',
        fontSize: 13,
        color: danger ? '#f87171' : 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
        textAlign: 'left',
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.1)' : 'var(--bg-hover)'
        e.currentTarget.style.color = danger ? '#f87171' : 'var(--text-primary)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = danger ? '#f87171' : 'var(--text-secondary)'
      }}
    >
      {icon}
      {label}
    </button>
  )
}

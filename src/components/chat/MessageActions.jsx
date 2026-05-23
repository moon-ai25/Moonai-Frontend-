import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Copy, RefreshCw, Edit2, Share2, ThumbsUp, ThumbsDown } from 'lucide-react'
import { stripMarkdown } from '../../utils/markdown'
import { submitFeedback } from '../../api/moonai'
import useChatStore from '../../store/chatStore'
import toast from 'react-hot-toast'

export default function MessageActions({
  message,
  messageIndex,
  onEdit,
  onRegenerate,
  onPin,
  isPinned,
}) {
  const isUser = message.role === 'user'
  const { user, currentChatId } = useChatStore()

  // Initialize from saved feedback on the message object
  const [liked, setLiked] = useState(message.feedback === 'like')
  const [disliked, setDisliked] = useState(message.feedback === 'dislike')
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  const getCleanText = () => {
    let text = message.content || ''
    text = text.replace(/!\[Uploaded Image\]\((.*?)\)/g, '')
    text = text.replace(/<moon-image-context>[\s\S]*?<\/moon-image-context>/g, '')
    text = text.replace(/_Image Context: [\s\S]*$/g, '')
    text = text.replace(/\[Image upload failed\]/g, '')
    return stripMarkdown(text.trim())
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCleanText())
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleShare = async () => {
    const text = getCleanText()
    if (navigator.share) {
      try {
        await navigator.share({ text })
      } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      toast.success('Message copied to clipboard')
    }
  }

  const sendFeedback = useCallback(async (newFeedback) => {
    if (feedbackLoading) return
    if (!user?.username || !currentChatId) return // no-op for unsaved chats

    setFeedbackLoading(true)
    try {
      await submitFeedback(user.username, currentChatId, messageIndex, newFeedback)
    } catch {
      // silent — don't block UI for feedback errors
    } finally {
      setFeedbackLoading(false)
    }
  }, [feedbackLoading, user, currentChatId, messageIndex])

  const handleLike = () => {
    const newLiked = !liked
    const newFeedback = newLiked ? 'like' : null
    setLiked(newLiked)
    if (newLiked) setDisliked(false)
    sendFeedback(newFeedback)
    if (newLiked) toast('Thanks for the feedback! 👍', { icon: '✨' })
  }

  const handleDislike = () => {
    const newDisliked = !disliked
    const newFeedback = newDisliked ? 'dislike' : null
    setDisliked(newDisliked)
    if (newDisliked) setLiked(false)
    sendFeedback(newFeedback)
    if (newDisliked) toast("Thanks — we'll keep improving! 🙏", { icon: '💬' })
  }

  return (
    <motion.div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: '2px 4px',
        background: 'transparent',
      }}
    >
      <ActionBtn icon={<Copy size={13} />} label="Copy" onClick={handleCopy} />

      {isUser ? (
        <ActionBtn icon={<Edit2 size={13} />} label="Edit" onClick={onEdit} />
      ) : (
        <>
          <ActionBtn icon={<Share2 size={13} />} label="Share" onClick={handleShare} />
          <ActionBtn icon={<RefreshCw size={13} />} label="Regenerate" onClick={onRegenerate} />
          <div style={{ width: 1, height: 14, background: 'var(--border-subtle)', margin: '0 2px' }} />
          <ActionBtn
            icon={<ThumbsUp size={13} />}
            label="Good response"
            onClick={handleLike}
            active={liked}
          />
          <ActionBtn
            icon={<ThumbsDown size={13} />}
            label="Bad response"
            onClick={handleDislike}
            active={disliked}
          />
        </>
      )}
    </motion.div>
  )
}

function ActionBtn({ icon, label, onClick, active }) {
  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      title={label}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 26,
        height: 26,
        borderRadius: 5,
        background: active ? 'var(--primary-transparent)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: active ? 'var(--primary-color)' : 'var(--text-tertiary)',
        transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = 'var(--text-primary)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = active ? 'var(--primary-color)' : 'var(--text-tertiary)'
      }}
    >
      {icon}
    </motion.button>
  )
}

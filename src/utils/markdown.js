/**
 * Strip markdown for plain-text copy
 */
export function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, '').trim())
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s/gm, '')
    .replace(/^[-*+]\s/gm, '• ')
    .replace(/^\d+\.\s/gm, '')
    .trim()
}

/**
 * Estimate token count (rough approximation: ~4 chars per token)
 */
export function estimateTokens(messages) {
  const total = messages.reduce((acc, m) => acc + (m.content?.length || 0), 0)
  return Math.ceil(total / 4)
}

/**
 * Token color based on count
 */
export function tokenColor(count) {
  if (count < 2000) return 'var(--accent-emerald)'
  if (count < 3000) return '#f59e0b'
  return 'var(--accent-red)'
}

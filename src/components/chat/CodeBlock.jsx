import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Copy, Check } from 'lucide-react'
import useChatStore from '../../store/chatStore'
import toast from 'react-hot-toast'

export default function CodeBlock({ children, className }) {
  const { setActiveCode } = useChatStore()
  const language = className?.replace('language-', '') || 'text'
  const [copied, setCopied] = React.useState(false)

  const extractText = (node) => {
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(extractText).join('')
    if (node?.props?.children) return extractText(node.props.children)
    return String(node || '')
  }

  const code = extractText(children).trimEnd()

  const lines = code.split('\n')
  const firstLine = lines[0].trim()
  const titleMatch = firstLine.match(/^\/\/ |^\/\* |^# |^<!-- |^\/\/\/ /)
  const title = titleMatch ? firstLine.replace(titleMatch[0], '').slice(0, 40) : 'Snippet'

  const handleOpen = () => {
    setActiveCode({ code, language, title })
  }

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (e) => {
    e.stopPropagation()
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'snippet'}.${language === 'text' ? 'txt' : language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Downloaded')
  }

  return (
    <motion.div
      onClick={handleOpen}
      style={{
        margin: '12px 0',
        padding: '12px 16px',
        width: '100%',
        boxSizing: 'border-box',
        background: 'transparent',
        border: '1px solid var(--border-medium)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
      }}
      whileHover={{ backgroundColor: 'var(--bg-elevated)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 40,
          height: 48,
          borderRadius: 8,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
        }}>
          <FileText size={20} strokeWidth={1.5} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--text-primary)',
            letterSpacing: '0.01em'
          }}>
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 12,
              color: 'var(--text-tertiary)',
            }}>
              Document · {language.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={handleCopy}
          style={{
            padding: '6px',
            borderRadius: '6px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Copy"
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
        >
          {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
        </button>
        <button
          onClick={handleDownload}
          style={{
            padding: '6px',
            borderRadius: '6px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Download"
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
        >
          <Download size={16} />
        </button>
      </div>
    </motion.div>
  )
}

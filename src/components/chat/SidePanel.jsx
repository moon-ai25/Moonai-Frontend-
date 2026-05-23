import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Download, Eye, Code2, Check, ExternalLink } from 'lucide-react'
import useChatStore from '../../store/chatStore'
import toast from 'react-hot-toast'
import hljs from 'highlight.js'
import MarkdownRenderer from './MarkdownRenderer'

export default function SidePanel() {
  const { isSidePanelOpen, activeCode, closeSidePanel, sidePanelWidth, setSidePanelWidth, isSidebarOpen } = useChatStore()
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState('code') // 'code' or 'preview'
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return
      
      const sidebarWidth = isSidebarOpen ? 260 : 48
      const containerWidth = window.innerWidth - sidebarWidth
      const pixelWidth = window.innerWidth - e.clientX
      
      // Calculate width as a percentage of the container (Chat + SidePanel area)
      let percentage = (pixelWidth / containerWidth) * 100
      
      // Constrain between 40% and 60% of the available area
      percentage = Math.min(Math.max(percentage, 40), 60)
      
      setSidePanelWidth(`${percentage}%`)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, setSidePanelWidth])

  useEffect(() => {
    if (isSidePanelOpen && viewMode === 'code') {
      hljs.highlightAll()
    }
  }, [isSidePanelOpen, activeCode, viewMode])

  useEffect(() => {
    // Reset to code view when opening a new snippet
    setViewMode('code')
  }, [activeCode])

  if (!isSidePanelOpen || !activeCode) return null

  const { code, language, title } = activeCode
  const isPreviewable = ['md', 'markdown', 'html'].includes(language?.toLowerCase())
  const isHtml = language?.toLowerCase() === 'html'

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    // Basic extension mapping
    const extMap = {
      javascript: 'js',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
      markdown: 'md'
    }
    const ext = extMap[language.toLowerCase()] || 'txt'
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'snippet'}.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleOpenNewTab = () => {
    sessionStorage.setItem('moon_preview_data', JSON.stringify({ 
      code, 
      lang: language, 
      title 
    }))
    window.open('/preview', '_blank')
  }

  const highlightCode = (code, lang) => {
    try {
      return hljs.highlight(code, { language: lang }).value
    } catch {
      return hljs.highlightAuto(code).value
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 250 }}
        style={{
          width: sidePanelWidth,
          height: '100%',
          background: 'var(--bg-primary)',
          borderLeft: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          position: 'relative',
        }}
      >
        {/* Resize Handle */}
        <div
          onMouseDown={() => setIsResizing(true)}
          style={{
            position: 'absolute',
            left: -3,
            top: 0,
            bottom: 0,
            width: 6,
            cursor: 'col-resize',
            zIndex: 100,
            background: isResizing ? 'var(--primary-color)' : 'transparent',
            transition: 'background 0.2s',
          }}
        />
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', borderRadius: '6px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
              {isPreviewable && (
                <button 
                  onClick={() => setViewMode('preview')}
                  style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    background: viewMode === 'preview' ? 'var(--bg-hover)' : 'transparent', 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: viewMode === 'preview' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Preview"
                >
                  <Eye size={16} />
                </button>
              )}
              <button 
                onClick={() => setViewMode('code')}
                style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  background: viewMode === 'code' ? 'var(--bg-hover)' : 'transparent', 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: viewMode === 'code' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title="Code"
              >
                <Code2 size={16} />
              </button>
            </div>
            
            <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
              {title || 'Snippet'}
            </h3>
            
            <div style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              letterSpacing: '0.05em'
            }}>
              · {language.toUpperCase()}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isPreviewable && viewMode === 'preview' && (
              <button
                onClick={handleOpenNewTab}
                style={iconBtn}
                title="Open in new tab"
                onMouseOver={(e) => Object.assign(e.currentTarget.style, iconBtnHover)}
                onMouseOut={(e) => Object.assign(e.currentTarget.style, iconBtn)}
              >
                <ExternalLink size={16} />
              </button>
            )}
            <button
              onClick={handleCopy}
              style={iconBtn}
              title="Copy"
              onMouseOver={(e) => Object.assign(e.currentTarget.style, iconBtnHover)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, iconBtn)}
            >
              {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
            </button>
            
            <button 
              onClick={handleDownload} 
              style={iconBtn} 
              title="Download"
              onMouseOver={(e) => Object.assign(e.currentTarget.style, iconBtnHover)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, iconBtn)}
            >
              <Download size={16} />
            </button>
            
            <div style={{ width: 1, height: 16, background: 'var(--border-subtle)', margin: '0 4px' }} />
            
            <button 
              onClick={closeSidePanel} 
              style={iconBtn}
              title="Close"
              onMouseOver={(e) => Object.assign(e.currentTarget.style, iconBtnHover)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, iconBtn)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Code Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: viewMode === 'code' ? '24px' : (isHtml ? '0' : '24px'),
            background: isHtml && viewMode === 'preview' ? 'white' : 'var(--bg-primary)',
            fontFamily: viewMode === 'code' ? 'var(--font-mono)' : 'inherit',
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {viewMode === 'code' ? (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <code
                className={`language-${language}`}
                dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
                style={{ color: 'var(--code-text)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              />
            </pre>
          ) : (
            isHtml ? (
              <iframe
                srcDoc={code}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title="Preview HTML"
              />
            ) : (
              <MarkdownRenderer content={code} />
            )
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

const iconBtn = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  color: 'var(--text-tertiary)',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '6px',
  transition: 'all 0.2s'
}

const iconBtnHover = {
  background: 'var(--bg-hover)',
  color: 'var(--text-primary)'
}

import React, { useEffect, useState } from 'react'
import MarkdownRenderer from '../components/chat/MarkdownRenderer'
import useChatStore from '../store/chatStore'
import { FileText } from 'lucide-react'

export default function PreviewPage() {
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('')
  const [title, setTitle] = useState('')
  const { theme, primaryColor } = useChatStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.setProperty('--primary-color', primaryColor)

    const storedData = sessionStorage.getItem('moon_preview_data')
    if (storedData) {
      const { code, lang, title } = JSON.parse(storedData)
      setContent(code)
      setLanguage(lang)
      setTitle(title)
      document.title = `Preview: ${title || 'Snippet'}`
    }
  }, [theme, primaryColor])

  if (!content) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-body)'
      }}>
        No content to preview.
      </div>
    )
  }

  const isHtml = language?.toLowerCase() === 'html'

  return (
    <div style={{ 
      height: '100vh', 
      background: isHtml ? 'white' : 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <style>{`
        .preview-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: var(--border-medium) transparent;
        }
        .preview-scroll-container::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .preview-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .preview-scroll-container::-webkit-scrollbar-thumb {
          background: var(--border-medium);
          border-radius: 10px;
          transition: background 0.2s;
        }
        .preview-scroll-container::-webkit-scrollbar-thumb:hover {
          background: var(--text-tertiary);
        }
      `}</style>

      {/* Floating Pill Header */}
      {!isHtml && (
        <div style={{ 
          position: 'absolute',
          top: 20,
          left: 20,
          right: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pointerEvents: 'none', // Allows clicking through the middle space
          zIndex: 10
        }}>
          {/* Left Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg-elevated)',
            padding: '10px 20px',
            borderRadius: '999px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            pointerEvents: 'auto'
          }}>
            <FileText size={18} color="var(--primary-color)" />
            <h1 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.01em' }}>
              {title || 'Document Preview'}
            </h1>
          </div>

          {/* Right Pill */}
          <div style={{
            background: 'var(--bg-elevated)',
            padding: '8px 16px',
            borderRadius: '999px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            pointerEvents: 'auto'
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.05em' }}>
              {language?.toUpperCase() || 'MARKDOWN'}
            </span>
          </div>
        </div>
      )}

      <div 
        className="preview-scroll-container"
        style={{ 
          flex: 1,
          overflowY: 'auto',
          padding: isHtml ? '0' : '80px 20px 40px', // Extra top padding to account for floating header
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{ 
          width: '100%', 
          maxWidth: isHtml ? '100%' : '850px',
          height: isHtml ? '100%' : 'auto',
        }}>
          {isHtml ? (
            <iframe
              srcDoc={content}
              style={{ width: '100%', height: '100%', border: 'none', background: 'white', display: 'block' }}
              title="HTML Preview"
            />
          ) : (
            <div className="markdown-container" style={{
              color: 'var(--text-primary)',
              lineHeight: 1.8,
              fontSize: '15px'
            }}>
              <MarkdownRenderer content={content} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import React, { memo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'

const MarkdownRenderer = memo(function MarkdownRenderer({ content, isGenerating }) {
  return (
    <div className={`markdown-content ${isGenerating ? 'is-generating' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks
          pre({ children }) {
            return (
              <CodeBlock className={children?.props?.className}>
                {children?.props?.children}
              </CodeBlock>
            )
          },
          code({ node, className, children, ...props }) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },

          // Tables with scroll wrapper
          table({ children }) {
            return (
              <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                <table>{children}</table>
              </div>
            )
          },

          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="markdown-quote">{children}</blockquote>
          ),

          // Custom images
          img: ({ src, alt }) => (
            <img src={src} alt={alt || ''} loading="lazy" className="markdown-image" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})

export default MarkdownRenderer

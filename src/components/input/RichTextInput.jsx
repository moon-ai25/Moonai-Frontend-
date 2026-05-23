import React, { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react'

const RichTextInput = forwardRef(function RichTextInput({ value, onChange, onKeyDown, onPaste, placeholder, disabled }, ref) {
  const editorRef = useRef(null)
  const isUpdatingExternally = useRef(false)

  // Sync external value to innerHTML
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      isUpdatingExternally.current = true
      editorRef.current.innerHTML = value
    }
  }, [value])

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (editorRef.current) {
        editorRef.current.focus()
      }
    }
  }))

  const getCaretNodeOffset = () => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    return { node: sel.anchorNode, offset: sel.anchorOffset }
  }

  const setCaretNodeOffset = (node, offset) => {
    const sel = window.getSelection()
    if (!sel || !node) return
    const range = document.createRange()
    try {
      range.setStart(node, offset)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    } catch (e) {
      console.warn("Could not restore caret", e)
    }
  }

  const handleInput = (e) => {
    if (isUpdatingExternally.current) {
      isUpdatingExternally.current = false
      return
    }

    const html = editorRef.current.innerHTML
    
    // Parse formatting natively
    // Note: To avoid cursor jumps, we only parse if the user typed markdown syntax.
    // Instead of parsing the whole HTML (which breaks cursor on every stroke), 
    // we detect specific key sequences or just let document.execCommand handle it.
    
    // Actually, handling inline parsing in onInput requires finding the specific text node.
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) {
      onChange(html)
      return
    }
    
    const node = sel.anchorNode
    if (node && node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent
      const offset = sel.anchorOffset

      // Auto-indent list start
      const autoIndentNumMatch = text.match(/^(\d+)\.\s$/)
      if (autoIndentNumMatch) {
        node.textContent = `   ${autoIndentNumMatch[1]}. `
        setCaretNodeOffset(node, node.textContent.length)
        onChange(editorRef.current.innerHTML)
        return
      }

      const autoIndentAlphaMatch = text.match(/^([a-zA-Z])\.\s$/)
      if (autoIndentAlphaMatch) {
        node.textContent = `   ${autoIndentAlphaMatch[1]}. `
        setCaretNodeOffset(node, node.textContent.length)
        onChange(editorRef.current.innerHTML)
        return
      }

      const autoIndentBulletMatch = text.match(/^([-*])\s$/)
      if (autoIndentBulletMatch) {
        node.textContent = `   ${autoIndentBulletMatch[1]} `
        setCaretNodeOffset(node, node.textContent.length)
        onChange(editorRef.current.innerHTML)
        return
      }

      // Check for **text** (inline code) - strictly 2 asterisks
      const codeMatch = text.match(/(?<!\*)\*\*(?!\*)(.+?)(?<!\*)\*\*(?!\*)/)
      if (codeMatch) {
        const matchIndex = codeMatch.index
        const matchLength = codeMatch[0].length
        
        // Select the text to replace
        const range = document.createRange()
        range.setStart(node, matchIndex)
        range.setEnd(node, matchIndex + matchLength)
        
        sel.removeAllRanges()
        sel.addRange(range)
        
        document.execCommand('insertHTML', false, `<code class="inline-code">${codeMatch[1]}</code>&#8203;`)
        onChange(editorRef.current.innerHTML)
        return
      }

      // Check for *text* (bold) - strictly 1 asterisk
      const boldMatch = text.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/)
      if (boldMatch) {
        const matchIndex = boldMatch.index
        const matchLength = boldMatch[0].length
        
        const range = document.createRange()
        range.setStart(node, matchIndex)
        range.setEnd(node, matchIndex + matchLength)
        
        sel.removeAllRanges()
        sel.addRange(range)
        
        document.execCommand('insertHTML', false, `<strong>${boldMatch[1]}</strong>&#8203;`)
        onChange(editorRef.current.innerHTML)
        return
      }
    }

    onChange(html)
  }

  const handleKeyDownWrapper = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Intercept Shift+Enter to continue lists!
      
      const sel = window.getSelection()
      if (sel && sel.anchorNode) {
        const node = sel.anchorNode
        const text = node.textContent || ''
        
        // Check Numbered List (e.g. "   1. Item" or "1. Item")
        const numMatch = text.match(/^(\s*)(\d+)\.\s+(.*)$/)
        if (numMatch) {
          e.preventDefault()
          e.stopPropagation() // Stop FloatingInputBar from sending the message!
          const spaces = numMatch[1]
          const currentNum = parseInt(numMatch[2], 10)
          const content = numMatch[3]
          
          if (!content.trim()) {
            // Empty item, exit list
            // We need to delete the current line and insert a plain div/br
            document.execCommand('insertHTML', false, '<br><br>')
            return
          } else {
            // Continue list
            // For contentEditable, inserting HTML requires breaking the line.
            // Using a plain div works best for line breaks in contentEditable.
            const nextPrefix = `\n${spaces}${currentNum + 1}. `
            document.execCommand('insertText', false, nextPrefix)
            return
          }
        }
        
        // Check Alphabetical List (e.g. "   a. Item" or "a. Item")
        const alphaMatch = text.match(/^(\s*)([a-zA-Z])\.\s+(.*)$/)
        if (alphaMatch) {
          e.preventDefault()
          e.stopPropagation()
          const spaces = alphaMatch[1]
          const currentChar = alphaMatch[2]
          const content = alphaMatch[3]
          
          if (!content.trim()) {
            document.execCommand('insertHTML', false, '<br><br>')
            return
          } else {
            const nextChar = String.fromCharCode(currentChar.charCodeAt(0) + 1)
            const nextPrefix = `\n${spaces}${nextChar}. `
            document.execCommand('insertText', false, nextPrefix)
            return
          }
        }
        
        // Check Bullet List (e.g. "   - Item" or "- Item" or "* Item")
        const bulletMatch = text.match(/^(\s*)([-*])\s+(.*)$/)
        if (bulletMatch) {
          e.preventDefault()
          e.stopPropagation()
          const spaces = bulletMatch[1]
          const bullet = bulletMatch[2]
          const content = bulletMatch[3]
          
          if (!content.trim()) {
            document.execCommand('insertHTML', false, '<br><br>')
            return
          } else {
            const nextPrefix = `\n${spaces}${bullet} `
            document.execCommand('insertText', false, nextPrefix)
            return
          }
        }
      }
    }
    
    // If not a list continuation, pass to parent (for Enter to Send or Shift+Enter)
    if (onKeyDown) onKeyDown(e)
  }

  const isEmpty = !value || value === '<br>' || value.trim() === ''

  return (
    <div
      ref={editorRef}
      className="rich-editor"
      contentEditable={!disabled}
      onInput={handleInput}
      onKeyDown={handleKeyDownWrapper}
      onPaste={onPaste}
      data-placeholder={placeholder}
      data-empty={isEmpty}
      suppressContentEditableWarning={true}
      style={{
        flex: 1,
        outline: 'none',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      }}
    />
  )
})

export default RichTextInput

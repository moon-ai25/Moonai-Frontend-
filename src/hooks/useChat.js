import { useCallback, useRef } from 'react'
import { sendChat, saveChat, generateTitle, uploadImage, regenerateChat } from '../api/moonai'
import { formatFileSize } from '../utils/fileHelpers'
import useChatStore from '../store/chatStore'
import toast from 'react-hot-toast'

export default function useChat() {
  const {
    messages,
    currentChatId,
    currentTitle,
    user,
    isGenerating,
    setMessages,
    addMessage,
    updateLastMessage,
    replaceMessageAt,
    setCurrentChatId,
    setCurrentTitle,
    setGenerating,
    addChatToList,
    renameChatInList,
    newChat: resetChat,
  } = useChatStore()

  const abortControllerRef = useRef(null)
  const saveTimerRef = useRef(null)
  const isSavedRef = useRef(false)

  const scheduleSave = useCallback(
    (msgs, title, chatId) => {
      if (!user || !title) return
      
      const executeSave = async () => {
        try {
          const res = await saveChat(
            user.userId,
            user.username,
            title,
            msgs.map(m => ({ 
              role: m.role, 
              content: m.content || ' ',
              ...(m.images?.length > 0 ? { images: m.images } : {}),
              ...(m.sources?.length > 0 ? { sources: m.sources } : {})
            }))
          )
          
          if (!chatId && res && res.chatId) {
             useChatStore.getState().setCurrentChatId(res.chatId)
             useChatStore.getState().renameChatInList(title, title, res.chatId)
          }
        } catch {
          // silent fail
        }
      }

      clearTimeout(saveTimerRef.current)
      
      if (!chatId) {
        // First save for a new chat -> save immediately to prevent data loss on fast refresh
        executeSave()
      } else {
        // Subsequent saves -> debounce by 2000ms
        saveTimerRef.current = setTimeout(executeSave, 2000)
      }
    },
    [user]
  )

  const sendMessage = useCallback(async (text, attachments = [], isWebSearch = false) => {
    if (!text.trim() && attachments.length === 0) return
      if (isGenerating) return

      // 1. Build initial local content (blob URLs)
      let localContent = text.trim()
      const uploadPromises = []

      for (const att of attachments) {
        if (att.type?.startsWith('image')) {
          const localUrl = att.preview || (att instanceof File ? URL.createObjectURL(att) : '') || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
          localContent += `\n\n![Uploaded Image](${localUrl})`
          uploadPromises.push(
            uploadImage(att).then(res => ({ file: att, ...res }))
          )
        } else {
          localContent += `\n\n[File: ${att.name} (${formatFileSize(att.size)})]`
        }
      }

      const userMsgId = Date.now().toString()
      const userMsg = {
        id: userMsgId,
        role: 'user',
        content: localContent.trim(),
        timestamp: new Date().toISOString(),
      }

      const updatedMessages = [...messages, userMsg]
      setMessages(updatedMessages)
      setGenerating(true)

      // Placeholder for streaming bot response
      const botPlaceholder = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true,
      }
      setMessages([...updatedMessages, botPlaceholder])

      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        // 2. Wait for background uploads to finish before hitting the AI
        let finalContent = text.trim()
        
        if (uploadPromises.length > 0) {
          try {
            const results = await Promise.all(uploadPromises)
            for (const res of results) {
               finalContent += `\n\n![Uploaded Image](${res.imageUrl})\n\n<moon-image-context>${res.extractedText}</moon-image-context>`
            }
          } catch (err) {
            console.error('Image upload failed', err)
            finalContent += `\n\n[Image upload failed]`
          }
        }
        
        // Also append non-image files to the final content
        for (const att of attachments) {
          if (!att.type?.startsWith('image')) {
             finalContent += `\n\n[File: ${att.name} (${formatFileSize(att.size)})]`
          }
        }

        // Update the user message payload with final Cloudinary URLs + OCR context
        const apiMessages = updatedMessages.map(({ role, content }) => ({ role, content }))
        apiMessages[apiMessages.length - 1].content = finalContent.trim()

        // Swap the UI blob URL with the permanent Cloudinary URL silently
        const currentMsgs = useChatStore.getState().messages
        setMessages(currentMsgs.map(m => m.id === userMsgId ? { ...m, content: finalContent.trim() } : m))

        // 3. Send to API
        let data
        if (isWebSearch) {
          const { webSearch } = await import('../api/moonai')
          data = await webSearch(finalContent.trim(), currentUser?.username, currentTitle)
        } else {
          data = await sendChat(apiMessages, controller.signal)
        }
        
        let reply = data.reply || ''
        
        // Handle cases where reply might be an object instead of a string
        if (typeof reply !== 'string') {
          reply = reply.content || reply.text || JSON.stringify(reply) || ''
        }
        
        if (!reply) {
          reply = ' ' // Prevent backend "Path `content` is required" error
        }

        const finalBotMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
          images: data.images || [],
          sources: data.sources || [],
          isJustGenerated: true,
        }

        // Get the latest messages which include the swapped Cloudinary URL for the user message
        const currentMsgsAfterUpload = useChatStore.getState().messages
        // Replace the placeholder bot message (which is currently the last one) with the real finalBotMsg
        const finalMessages = currentMsgsAfterUpload.map(m => m.isStreaming ? finalBotMsg : m)
        setMessages(finalMessages)

        // Auto-generate title on first exchange
        let title = currentTitle
        if (!title && updatedMessages.length === 1) {
          try {
            title = await generateTitle(finalContent.trim())
          } catch {
            title = finalContent.slice(0, 40) + (finalContent.length > 40 ? '…' : '')
          }
          
          // Ensure title uniqueness to prevent chats merging
          const existingTitles = useChatStore.getState().chatList.map(c => c.title)
          let uniqueTitle = title
          let counter = 1
          while (existingTitles.includes(uniqueTitle)) {
            uniqueTitle = `${title} (${counter})`
            counter++
          }
          title = uniqueTitle

          setCurrentTitle(title)
          addChatToList({
            title,
            username: user?.username,
            updatedAt: new Date().toISOString(),
          })
        }

        scheduleSave(finalMessages, title || currentTitle, currentChatId)
      } catch (err) {
        if (err.name === 'CanceledError' || controller.signal.aborted) {
          // User aborted — keep what was streamed
          const msgs = useChatStore.getState().messages
          setMessages(msgs.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)))
        } else {
          const errMsg = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: '⚠️ Moon AI is resting... Please try again in a moment.',
            timestamp: new Date().toISOString(),
            isError: true,
          }
          setMessages([...updatedMessages, errMsg])
          toast.error('Failed to get a response. Retrying...')
        }
      } finally {
        setGenerating(false)
        abortControllerRef.current = null
      }
    },
    [
      messages,
      isGenerating,
      currentChatId,
      currentTitle,
      user,
      setMessages,
      setGenerating,
      updateLastMessage,
      setCurrentTitle,
      addChatToList,
      scheduleSave,
    ]
  )

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort()
  }, [])

  // ─── editAndResend: replace message at index, truncate after, regenerate reply ─
  const editAndResend = useCallback(
    async (index, newContent) => {
      if (isGenerating) return

      // Build the new message history: slice up to (not including) the edited index
      // then push the updated user message
      const editedMsg = { ...messages[index], content: newContent, id: messages[index].id }
      const truncated = messages.slice(0, index)
      const updatedHistory = [...truncated, editedMsg]

      // Show updated history immediately (no duplicate user msg)
      setMessages(updatedHistory)
      setGenerating(true)

      // Placeholder for streaming bot response
      const botPlaceholder = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true,
      }
      setMessages([...updatedHistory, botPlaceholder])

      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        // Build clean API messages from the updated history
        const apiMessages = updatedHistory.map(({ role, content }) => ({ role, content }))
        const data = await sendChat(apiMessages, controller.signal)

        let reply = data.reply || ''
        if (typeof reply !== 'string') reply = reply.content || reply.text || JSON.stringify(reply) || ''
        if (!reply) reply = ' '

        const finalBotMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
          images: data.images || [],
          sources: data.sources || [],
          isJustGenerated: true,
        }

        const finalMessages = [...updatedHistory, finalBotMsg]
        setMessages(finalMessages)

        // Persist the updated chat
        scheduleSave(finalMessages, currentTitle, currentChatId)
      } catch (err) {
        if (err.name === 'CanceledError' || controller.signal.aborted) {
          const msgs = useChatStore.getState().messages
          setMessages(msgs.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)))
        } else {
          const errMsg = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: '⚠️ Moon AI is resting... Please try again in a moment.',
            timestamp: new Date().toISOString(),
            isError: true,
          }
          setMessages([...updatedHistory, errMsg])
          toast.error('Failed to get a response.')
        }
      } finally {
        setGenerating(false)
        abortControllerRef.current = null
      }
    },
    [messages, isGenerating, currentChatId, currentTitle, setMessages, setGenerating, scheduleSave]
  )

  // ─── regenerateLastResponse: backend for saved chats, local for new chats ───
  const regenerateLastResponse = useCallback(async () => {
    if (messages.length < 2 || isGenerating) return

    // Remove the last assistant message from local state
    const withoutLast = messages[messages.length - 1]?.role === 'assistant'
      ? messages.slice(0, -1)
      : messages

    setMessages(withoutLast)
    setGenerating(true)

    // Placeholder
    const botPlaceholder = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    }
    setMessages([...withoutLast, botPlaceholder])

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      let reply = ''
      let images = []
      let sources = []

      if (currentChatId && currentTitle && user?.username) {
        // Use backend regenerate for saved chats
        try {
          const data = await regenerateChat(user.username, currentTitle)
          reply = data.reply || ''
          images = data.images || []
          sources = data.sources || []
        } catch {
          // Fallback to local regeneration
          const apiMessages = withoutLast.map(({ role, content }) => ({ role, content }))
          const data = await sendChat(apiMessages, controller.signal)
          reply = data.reply || ''
          images = data.images || []
          sources = data.sources || []
        }
      } else {
        // Local regeneration for unsaved chats
        const apiMessages = withoutLast.map(({ role, content }) => ({ role, content }))
        const data = await sendChat(apiMessages, controller.signal)
        reply = data.reply || ''
        images = data.images || []
        sources = data.sources || []
      }

      if (typeof reply !== 'string') reply = reply.content || reply.text || JSON.stringify(reply) || ''
      if (!reply) reply = ' '

      const finalBotMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
        images,
        sources,
        isJustGenerated: true,
      }

      const finalMessages = [...withoutLast, finalBotMsg]
      setMessages(finalMessages)
      scheduleSave(finalMessages, currentTitle, currentChatId)
    } catch (err) {
      if (err.name === 'CanceledError' || controller.signal.aborted) {
        const msgs = useChatStore.getState().messages
        setMessages(msgs.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)))
      } else {
        const errMsg = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: '⚠️ Failed to regenerate. Please try again.',
          timestamp: new Date().toISOString(),
          isError: true,
        }
        setMessages([...withoutLast, errMsg])
        toast.error('Regeneration failed.')
      }
    } finally {
      setGenerating(false)
      abortControllerRef.current = null
    }
  }, [messages, isGenerating, currentChatId, currentTitle, user, setMessages, setGenerating, scheduleSave])

  const loadChat = useCallback(
    (chatData) => {
      setCurrentChatId(chatData._id)
      setCurrentTitle(chatData.title)
      setMessages(
        (chatData.messages || []).map((m, i) => ({
          ...m,
          id: m._id || String(i),
          timestamp: m.createdAt || new Date().toISOString(),
        }))
      )
    },
    [setCurrentChatId, setCurrentTitle, setMessages]
  )

  const startNewChat = useCallback(() => {
    clearTimeout(saveTimerRef.current)
    resetChat()
  }, [resetChat])

  return {
    messages,
    isGenerating,
    currentChatId,
    currentTitle,
    sendMessage,
    stopGeneration,
    editAndResend,
    regenerateLastResponse,
    loadChat,
    startNewChat,
  }
}

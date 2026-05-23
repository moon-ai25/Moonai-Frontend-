import { useCallback } from 'react'
import useChatStore from '../store/chatStore'

export default function usePinned(chatId) {
  const { pinnedMessages, setPinnedMessages, togglePin } = useChatStore()

  const loadPins = useCallback(() => {
    if (!chatId) return
    try {
      const pins = JSON.parse(localStorage.getItem(`pinned_${chatId}`) || '[]')
      setPinnedMessages(pins)
    } catch {
      setPinnedMessages([])
    }
  }, [chatId, setPinnedMessages])

  const isPinned = useCallback(
    (msgId) => pinnedMessages.some((p) => p.id === msgId),
    [pinnedMessages]
  )

  const pin = useCallback(
    (msg) => {
      if (!chatId) return
      togglePin(chatId, msg)
    },
    [chatId, togglePin]
  )

  return { pinnedMessages, loadPins, isPinned, pin }
}

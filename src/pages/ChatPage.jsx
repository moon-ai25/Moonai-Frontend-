import React, { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import ChatWindow from '../components/chat/ChatWindow'
import FloatingInputBar from '../components/input/FloatingInputBar'
import useChat from '../hooks/useChat'

export default function ChatPage() {
  const { sendMessage } = useChat()
  const [attachments, setAttachments] = useState([])

  return (
    <AppLayout>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ChatWindow
          onSendSuggestion={(text) => sendMessage(text)}
          attachedFiles={attachments}
        />
        <FloatingInputBar />
      </div>
    </AppLayout>
  )
}

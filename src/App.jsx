import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import useChatStore from './store/chatStore'
import { getStoredUser } from './hooks/useAuth'
import AuthModal from './components/auth/AuthModal'
import Spinner from './components/ui/Spinner'

// Lazy-loaded page chunks
const ChatPage = lazy(() => import('./pages/ChatPage'))
const SharedChatPage = lazy(() => import('./pages/SharedChatPage'))
const PreviewPage = lazy(() => import('./pages/PreviewPage'))

function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-primary)',
      }}
    >
      <Spinner size={40} />
    </div>
  )
}

export default function App() {
  const { user, setUser } = useChatStore()

  // Restore user from localStorage on mount
  useEffect(() => {
    const stored = getStoredUser()
    if (stored) setUser(stored)
  }, [setUser])

  const isAuthed = !!user
  const { theme } = useChatStore()

  // Apply Theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      {/* Notification toasts */}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: 'var(--accent-emerald)', secondary: 'var(--bg-elevated)' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: 'var(--bg-elevated)' },
          },
        }}
      />

      {/* Auth gate */}
      <AnimatePresence>
        {!isAuthed && <AuthModal key="auth-modal" />}
      </AnimatePresence>

      {/* Routes */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={isAuthed ? <ChatPage /> : <PageLoader />}
          />
          <Route path="/shared/:shareId" element={<SharedChatPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

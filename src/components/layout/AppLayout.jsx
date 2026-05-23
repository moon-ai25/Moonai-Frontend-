import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeftOpen, PanelLeftClose, Search, Pin } from 'lucide-react'
import useChatStore from '../../store/chatStore'
import Sidebar from '../sidebar/Sidebar'
import MobileDrawer from './MobileDrawer'
import { pageEntranceTimeline } from '../../animations/gsapPresets'
import { ping } from '../../api/moonai'
import useSearch from '../../hooks/useSearch'
import SettingsModal from './SettingsModal'
import SidePanel from '../chat/SidePanel'
import TempChatIcon from '../icons/TempChatIcon'
import NewChatIcon from '../icons/NewChatIcon'
import useChat from '../../hooks/useChat'

export default function AppLayout({ children }) {
  const { isSidebarOpen, toggleSidebar, user, isFocusMode, isTempChat, setTempChat, messages } = useChatStore()
  const { startNewChat } = useChat()
  const isEmpty = !messages || messages.length === 0
  const { openSearch } = useSearch()
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth > 768)
  const pingRef = useRef(null)

  // Handle responsive resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Heartbeat ping
  useEffect(() => {
    if (!user?.username) return
    pingRef.current = setInterval(() => {
      ping(user.username, user.isGuest)
    }, 30000)
    return () => clearInterval(pingRef.current)
  }, [user])

  // Keyboard shortcut: Ctrl+F for search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        openSearch()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openSearch])


  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        height: '100dvh',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}
    >
      {/* Desktop Sidebar */}
      {isDesktop && (
        <aside
          style={{
            width: isSidebarOpen ? 260 : 48,
            overflow: 'visible',
            flexShrink: 0,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            zIndex: 150,
          }}
        >
          <Sidebar isOpen={isSidebarOpen} />
        </aside>
      )}

      {/* Mobile Drawer */}
      {!isDesktop && <MobileDrawer />}

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Top Header Bar (Pill Layout) */}
        <header
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'transparent',
            zIndex: 10,
            pointerEvents: 'none', // Let clicks pass through the transparent middle
          }}
        >
          {/* Left Pill (Toggle & Title) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--bg-elevated)',
              padding: '6px 16px 6px 6px',
              borderRadius: '999px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              pointerEvents: 'auto', // Restore clicks
              marginLeft: isSidebarOpen ? 0 : 16,
              transition: 'margin 0.3s ease',
            }}
          >
            <button
              id="sidebar-toggle-btn"
              onClick={toggleSidebar}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--bg-hover)',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {isSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', paddingRight: 4 }}>
              <ChatTitle />
            </div>
          </div>

          {/* Right Pill (Temp Chat / New Chat) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-elevated)',
              padding: '2px',
              borderRadius: '999px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              pointerEvents: 'auto',
            }}
          >
            {isEmpty ? (
              <button
                onClick={() => setTempChat(!isTempChat)}
                title={isTempChat ? "Turn off Temporary Chat" : "Temporary Chat"}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <TempChatIcon active={isTempChat} size={24} />
              </button>
            ) : (
              <button
                onClick={startNewChat}
                title="New Chat"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <NewChatIcon size={24} />
              </button>
            )}
          </div>
        </header>

        {/* Main area container */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', position: 'relative' }}>
          {/* Left: Chat Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            {/* Page content */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {children}
            </div>
          </div>

          {/* Right: Side Panel (Code Artifacts) */}
          <AnimatePresence>
            <SidePanel />
          </AnimatePresence>
        </div>
      </div>

      {/* Modals & Overlays */}
      <SettingsModal />
    </div>
  )
}

function ChatTitle() {
  const { currentTitle, isTempChat } = useChatStore()
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={isTempChat ? 'temp' : (currentTitle || 'default')}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          fontWeight: 500,
          color: (isTempChat || currentTitle) ? 'var(--text-secondary)' : 'var(--text-tertiary)',
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {isTempChat ? 'Temporary Chat' : (currentTitle || 'Moon AI')}
      </motion.span>
    </AnimatePresence>
  )
}

const headerIconBtn = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  borderRadius: 'var(--radius-sm)',
  background: 'transparent',
  border: 'none',
  color: 'var(--text-tertiary)',
  cursor: 'pointer',
}

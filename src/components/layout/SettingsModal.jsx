import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Moon, Sun, Mail, AtSign, LogOut, User, Palette, Info } from 'lucide-react'
import useChatStore from '../../store/chatStore'
import useAuth from '../../hooks/useAuth'

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'about', label: 'About', icon: Info },
]

export default function SettingsModal() {
  const { isSettingsOpen, setSettingsOpen, theme, setTheme, user } = useChatStore()
  const { logout } = useAuth()
  const [tab, setTab] = useState('profile')
  const [imgError, setImgError] = useState(false)

  if (!isSettingsOpen) return null

  const displayName = user?.name || user?.username || 'User'
  const initial = displayName?.[0]?.toUpperCase() || '?'

  const handleLogout = () => {
    setSettingsOpen(false)
    logout()
  }

  return (
    <AnimatePresence>
      <motion.div
        key="settings-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}
        onClick={() => setSettingsOpen(false)}
      >
        <motion.div
          key="settings-panel"
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', damping: 30, stiffness: 340 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: 720,
            height: 460,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 32px 96px rgba(0,0,0,0.6)',
          }}
        >
          {/* ── LEFT NAV PANEL ─────────────────────────────── */}
          <div style={{
            width: 200,
            flexShrink: 0,
            background: 'var(--bg-primary)',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 10px',
            gap: 2,
          }}>
            {/* User avatar + name at top */}
            {user && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 8, padding: '8px 6px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: 12,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'var(--primary-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 20,
                  color: 'var(--bg-primary)',
                  overflow: 'hidden',
                  border: '2px solid var(--border-medium)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                }}>
                  {user.profile && !imgError ? (
                    <img
                      src={user.profile}
                      alt={displayName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => setImgError(true)}
                    />
                  ) : initial}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', maxWidth: 160,
                  }}>
                    {displayName}
                  </div>
                  {user.email && (
                    <div style={{
                      fontSize: 10.5, color: 'var(--text-tertiary)',
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap', maxWidth: 160, marginTop: 2,
                    }}>
                      {user.email}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Nav tabs */}
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  width: '100%', padding: '9px 12px',
                  borderRadius: 9,
                  background: tab === id ? 'var(--bg-elevated)' : 'transparent',
                  border: tab === id ? '1px solid var(--border-subtle)' : '1px solid transparent',
                  cursor: 'pointer', textAlign: 'left',
                  color: tab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: tab === id ? 600 : 500,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { if (tab !== id) { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)' }}}
                onMouseLeave={(e) => { if (tab !== id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}}
              >
                <Icon size={14} strokeWidth={1.9} style={{ flexShrink: 0 }} />
                {label}
              </button>
            ))}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Logout at bottom */}
            {user && (
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  width: '100%', padding: '9px 12px',
                  borderRadius: 9,
                  background: 'transparent',
                  border: '1px solid transparent',
                  cursor: 'pointer', textAlign: 'left',
                  color: '#f87171', fontSize: 13,
                  fontFamily: 'var(--font-body)', fontWeight: 500,
                  transition: 'all 0.13s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <LogOut size={14} strokeWidth={1.9} style={{ flexShrink: 0 }} />
                Sign out
              </button>
            )}
          </div>

          {/* ── RIGHT CONTENT PANEL ───────────────────────── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              flexShrink: 0,
            }}>
              <h2 style={{
                fontSize: 16, fontWeight: 700,
                color: 'var(--text-primary)', margin: 0,
                fontFamily: 'var(--font-display)', letterSpacing: '-0.01em',
              }}>
                {NAV_ITEMS.find(n => n.id === tab)?.label}
              </h2>
              <button
                onClick={() => setSettingsOpen(false)}
                style={{
                  background: 'var(--bg-hover)', border: 'none',
                  color: 'var(--text-tertiary)', cursor: 'pointer',
                  padding: '5px 5px', display: 'flex', borderRadius: 8,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
              >
                <X size={17} />
              </button>
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

              {/* ── PROFILE TAB ── */}
              {tab === 'profile' && user && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <SectionLabel>Account info</SectionLabel>
                  {user.email && (
                    <InfoRow icon={<Mail size={13} />} label="Email" value={user.email} />
                  )}
                  {user.username && (
                    <InfoRow icon={<AtSign size={13} />} label="Username" value={user.username} />
                  )}
                  {user.name && (
                    <InfoRow icon={<User size={13} />} label="Display Name" value={user.name} />
                  )}
                </div>
              )}

              {/* ── APPEARANCE TAB ── */}
              {tab === 'appearance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <SectionLabel>Theme</SectionLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { value: 'light', icon: <Sun size={18} />, label: 'Light', desc: 'Clean & bright' },
                      { value: 'dark', icon: <Moon size={18} />, label: 'Dark', desc: 'Easy on eyes' },
                    ].map(({ value, icon, label, desc }) => {
                      const active = theme === value
                      return (
                        <button
                          key={value}
                          onClick={() => setTheme(value)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '14px 16px',
                            borderRadius: 12,
                            background: active ? 'var(--primary-transparent)' : 'var(--bg-primary)',
                            border: `1.5px solid ${active ? 'var(--primary-color)' : 'var(--border-subtle)'}`,
                            color: active ? 'var(--primary-color)' : 'var(--text-secondary)',
                            cursor: 'pointer', textAlign: 'left',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ flexShrink: 0 }}>{icon}</span>
                          <div>
                            <div style={{
                              fontSize: 13, fontWeight: active ? 700 : 600,
                              color: active ? 'var(--primary-color)' : 'var(--text-primary)',
                              fontFamily: 'var(--font-body)',
                            }}>{label}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{desc}</div>
                          </div>
                          {active && (
                            <div style={{
                              marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%',
                              background: 'var(--primary-color)', flexShrink: 0,
                            }} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── ABOUT TAB ── */}
              {tab === 'about' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <SectionLabel>Moon AI</SectionLabel>
                  <div style={{
                    padding: '16px', borderRadius: 12,
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    {[
                      { label: 'Version', value: '2.0.0' },
                      { label: 'Model', value: 'Groq · LLaMA 3' },
                      { label: 'Build', value: 'Production' },
                    ].map(({ label, value }) => (
                      <div key={label} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '6px 0',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}>
                        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>{label}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{value}</span>
                      </div>
                    ))}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '6px 0',
                    }}>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>Status</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#34d399', fontWeight: 600 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.09em',
      color: 'var(--text-tertiary)', fontWeight: 700,
      fontFamily: 'var(--font-body)', marginBottom: 2,
    }}>
      {children}
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', borderRadius: 10,
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-subtle)',
    }}>
      <span style={{ color: 'var(--text-tertiary)', display: 'flex', flexShrink: 0 }}>{icon}</span>
      <span style={{
        fontSize: 11, color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-body)', minWidth: 72, flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 13, color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)', fontWeight: 500,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
      }}>
        {value}
      </span>
    </div>
  )
}

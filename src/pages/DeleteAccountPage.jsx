import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, AlertTriangle, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { deleteAccount } from '../api/moonai'
import useChatStore from '../store/chatStore'

export default function DeleteAccountPage() {
  const navigate = useNavigate()
  const { user, setUser } = useChatStore()

  const [step, setStep] = useState('warn')   // 'warn' | 'confirm' | 'done'
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [typed, setTyped] = useState('')

  const isGoogle = user?.loginType === 'google' || user?.loginType === 'temp'
  const confirmPhrase = 'DELETE MY ACCOUNT'

  useEffect(() => {
    document.body.classList.add('scrollable-page')
    return () => document.body.classList.remove('scrollable-page')
  }, [])

  const handleDelete = async () => {
    if (!user?.username) return
    setError('')
    setLoading(true)
    try {
      await deleteAccount(user.username, isGoogle ? undefined : password)
      // Clear local user session
      localStorage.removeItem('moon_user')
      setUser(null)
      setStep('done')
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canDelete = isGoogle
    ? typed === confirmPhrase
    : typed === confirmPhrase && password.length >= 6

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '20px 40px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
          <ArrowLeft size={16} />
          Back
        </Link>
        <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }} />
        <h1
          style={{
            fontFamily: "'Pixelify Sans', var(--font-display)",
            fontSize: '24px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary-color) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
          }}
        >
          Moon AI
        </h1>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: 520,
          margin: '60px auto',
          padding: '0 24px 80px',
        }}
      >
        <AnimatePresence mode="wait">

          {/* Step 1: Warning */}
          {step === 'warn' && (
            <motion.div
              key="warn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trash2 size={32} color="#ef4444" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
                Delete Account
              </h2>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 36, lineHeight: 1.6 }}>
                You're about to permanently delete your Moon AI account.
                This action <strong style={{ color: 'var(--text-primary)' }}>cannot be undone</strong>.
              </p>

              {/* What gets deleted */}
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 16,
                  padding: '20px 24px',
                  marginBottom: 28,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <AlertTriangle size={16} color="#ef4444" />
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#ef4444' }}>What will be permanently deleted</span>
                </div>
                {[
                  'Your account and profile information',
                  'All your chat conversations and history',
                  'All saved folders and projects',
                  'Any shared chat links you created',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#ef4444',
                        marginTop: 7,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <Link
                  to="/"
                  style={{
                    flex: 1,
                    padding: '13px 0',
                    borderRadius: 12,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: 14,
                    transition: 'background 0.2s',
                  }}
                >
                  Cancel
                </Link>
                <button
                  onClick={() => setStep('confirm')}
                  style={{
                    flex: 1,
                    padding: '13px 0',
                    borderRadius: 12,
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.4)',
                    color: '#ef4444',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Confirm + Password */}
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => { setStep('warn'); setError(''); setTyped(''); setPassword('') }}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                  padding: 0, marginBottom: 28, fontSize: 14,
                }}
              >
                <ArrowLeft size={14} /> Back
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
                Confirm deletion
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6, fontSize: 14 }}>
                Signed in as <strong style={{ color: 'var(--text-primary)' }}>@{user?.username}</strong>.
                {' '}To confirm, type <strong style={{ color: '#ef4444', fontFamily: 'var(--font-mono)' }}>{confirmPhrase}</strong> below.
              </p>

              {/* Type confirmation */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.5px', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                  Type to confirm
                </label>
                <input
                  type="text"
                  value={typed}
                  onChange={e => setTyped(e.target.value)}
                  placeholder={confirmPhrase}
                  autoComplete="off"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'var(--bg-elevated)',
                    border: `1px solid ${typed === confirmPhrase ? 'rgba(16,185,129,0.5)' : 'var(--border-medium)'}`,
                    borderRadius: 12,
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border 0.2s',
                  }}
                />
              </div>

              {/* Password input for manual accounts */}
              {!isGoogle && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.5px', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                    Your password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      style={{
                        width: '100%',
                        padding: '12px 44px 12px 14px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 12,
                        color: 'var(--text-primary)',
                        fontSize: 14,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-tertiary)', display: 'flex', padding: 0,
                      }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 10,
                    color: '#ef4444',
                    fontSize: 13,
                    marginBottom: 20,
                  }}
                >
                  {error}
                </div>
              )}

              <button
                onClick={handleDelete}
                disabled={!canDelete || loading}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  borderRadius: 12,
                  background: canDelete ? '#ef4444' : 'var(--bg-elevated)',
                  border: `1px solid ${canDelete ? '#ef4444' : 'var(--border-subtle)'}`,
                  color: canDelete ? '#fff' : 'var(--text-tertiary)',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: canDelete && !loading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete My Account Forever
                  </>
                )}
              </button>

              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
                This action is permanent and cannot be reversed.
              </p>
            </motion.div>
          )}

          {/* Step 3: Done */}
          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle size={32} color="#10b981" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 12 }}>
                Account Deleted
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 36, lineHeight: 1.6 }}>
                Your account and all associated data have been permanently removed.
                We're sorry to see you go.
              </p>

              <a
                href="/"
                style={{
                  display: 'inline-block',
                  padding: '13px 32px',
                  borderRadius: 12,
                  background: 'var(--primary-color)',
                  color: 'var(--bg-primary)',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
              >
                Go to Home
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

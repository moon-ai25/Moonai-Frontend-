import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import Spinner from '../ui/Spinner'

export default function LoginForm({ onLogin, isLoading, error }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(identifier, password)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={fieldWrap}>
        <Mail size={15} color="var(--text-tertiary)" style={fieldIcon} />
        <input
          id="login-identifier"
          type="text"
          placeholder="Email or username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          style={inputStyle}
          autoComplete="username"
        />
      </div>

      <div style={fieldWrap}>
        <Lock size={15} color="var(--text-tertiary)" style={fieldIcon} />
        <input
          id="login-password"
          type={showPass ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ ...inputStyle, paddingRight: 40 }}
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex' }}
        >
          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171', fontSize: 13 }}
        >
          <AlertCircle size={13} />
          {error}
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={isLoading}
        whileTap={{ scale: 0.97 }}
        style={submitBtn}
      >
        {isLoading ? <Spinner size={18} color="white" /> : 'Sign In'}
      </motion.button>
    </form>
  )
}

const fieldWrap = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
}

const fieldIcon = {
  position: 'absolute',
  left: 12,
  pointerEvents: 'none',
}

const inputStyle = {
  width: '100%',
  padding: '12px 12px 12px 38px',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-medium)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-primary)',
  fontSize: 14,
  transition: 'border-color 0.15s',
  fontFamily: 'var(--font-body)',
}

const submitBtn = {
  width: '100%',
  padding: '13px',
  background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  color: 'white',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  marginTop: 4,
  boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
}

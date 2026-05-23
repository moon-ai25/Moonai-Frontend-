import { useState, useCallback } from 'react'
import { login as apiLogin, register as apiRegister, saveTempUser, saveGoogleUser } from '../api/moonai'
import useChatStore from '../store/chatStore'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'moonai_user'

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

function storeUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export default function useAuth() {
  const setUser = useChatStore((s) => s.setUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const clearError = () => setError(null)

  const finalize = useCallback(
    (userData) => {
      storeUser(userData)
      setUser(userData)
    },
    [setUser]
  )

  const login = useCallback(
    async (identifier, password) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await apiLogin(identifier, password)
        finalize({
          userId: data.userId,
          username: data.username,
          email: data.email,
          folders: data.folders || [],
        })
        toast.success(`Welcome back, ${data.username}! 🌙`)
        return true
      } catch (err) {
        setError(err.message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [finalize]
  )

  const registerUser = useCallback(
    async (username, email, password) => {
      setIsLoading(true)
      setError(null)
      try {
        await apiRegister(username, email, password)
        // Auto-login after register
        const data = await apiLogin(email, password)
        finalize({
          userId: data.userId,
          username: data.username || username,
          email: data.email || email,
          folders: data.folders || [],
        })
        toast.success(`Welcome to Moon AI, ${username}! 🌙`)
        return true
      } catch (err) {
        setError(err.message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [finalize]
  )

  const continueAsGuest = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const guestId = Math.random().toString(36).slice(2, 8)
      const username = `guest_${guestId}`
      await saveTempUser(username)
      finalize({ userId: null, username, email: null, isGuest: true })
      toast.success(`Continuing as ${username} 🌙`)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [finalize])

  const loginWithGoogle = useCallback(
    async (credentialResponse) => {
      setIsLoading(true)
      setError(null)
      try {
        // Google GSI passes a CredentialResponse object: { credential, select_by, ... }
        // The actual JWT token is at credentialResponse.credential
        const token = typeof credentialResponse === 'string'
          ? credentialResponse
          : credentialResponse?.credential

        if (!token) {
          console.error('[Google Auth] ❌ No credential token received:', credentialResponse)
          throw new Error('No Google credential received. Please try again.')
        }

        console.debug('[Google Auth] ✅ Token received (first 40 chars):', token.slice(0, 40))

        // Google JWT uses URL-safe base64: replace - with + and _ with /
        // then pad to multiple of 4 before atob()
        const parts = token.split('.')
        if (parts.length !== 3) {
          console.error('[Google Auth] ❌ Invalid JWT structure, parts:', parts.length)
          throw new Error('Invalid Google token format.')
        }

        const base64Payload = parts[1]
          .replace(/-/g, '+')
          .replace(/_/g, '/')
          .padEnd(Math.ceil(parts[1].length / 4) * 4, '=')

        const payload = JSON.parse(atob(base64Payload))
        console.debug('[Google Auth] ✅ JWT decoded:', { name: payload.name, email: payload.email })

        const { name, email, picture } = payload

        if (!email) {
          throw new Error('Could not extract email from Google token.')
        }

        console.debug('[Google Auth] 📡 Calling /api/save-google-user...')
        const data = await saveGoogleUser(name, email, picture)
        console.debug('[Google Auth] ✅ Backend response:', data)

        if (!data) {
          throw new Error('Empty response from server.')
        }

        finalize({
          userId: data.userId,
          username: data.username || email.split('@')[0],
          email: data.email || email,
          name: data.name || name,
          profile: data.profile || picture,
          folders: data.folders || [],
        })

        toast.success(`Welcome, ${data.name || name}! 🌙`)
        return true
      } catch (err) {
        console.error('[Google Auth] ❌ Login failed:', err.message, err)
        setError(err.message)
        toast.error(`Google login failed: ${err.message}`)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [finalize]
  )

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    toast('Logged out. See you soon! 🌙', { icon: '👋' })
  }, [setUser])

  return {
    isLoading,
    error,
    clearError,
    login,
    registerUser,
    continueAsGuest,
    loginWithGoogle,
    logout,
  }
}

import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://moon-ai-rxmz.onrender.com'

export default function useSocket(username) {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!username) return

    const socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    return () => {
      socket.disconnect()
    }
  }, [username])

  return { socket: socketRef.current, isConnected }
}

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'
import { voiceRecordingPulse } from '../../animations/gsapPresets'
import Tooltip from '../ui/Tooltip'
import toast from 'react-hot-toast'

const AudioWave = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 16 }}>
    {[1.5, 1.1, 1.8, 1.3].map((dur, i) => (
      <motion.div
        key={i}
        animate={{ height: ['40%', '100%', '40%'] }}
        transition={{
          duration: dur,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: 3,
          height: '100%',
          background: 'currentColor',
          borderRadius: 2,
        }}
      />
    ))}
  </div>
)

export default function VoiceButton({ onTranscript }) {
  const [state, setState] = useState('idle') // idle | recording | processing
  const recognitionRef = useRef(null)

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in your browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setState('recording')
    }

    recognition.onresult = (e) => {
      setState('processing')
      const transcript = e.results[0][0].transcript
      onTranscript?.(transcript)
      setState('idle')
    }

    recognition.onerror = () => {
      toast.error('Speech recognition error')
      setState('idle')
    }

    recognition.onend = () => {
      setState('idle')
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setState('idle')
  }

  const handleClick = () => {
    if (state === 'idle') startRecording()
    else stopRecording()
  }

  return (
    <Tooltip label={state === 'idle' ? 'Click to speak' : 'Stop recording'} placement="top">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={handleClick}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'transparent',
          border: '1px solid transparent',
          cursor: 'pointer',
          color: 'var(--bg-primary)',
          transition: 'all 0.2s',
          overflow: 'visible',
        }}
      >
        {state === 'recording' ? (
          <AudioWave />
        ) : (
          <Mic size={20} color="var(--bg-primary)" />
        )}
      </motion.button>
    </Tooltip>
  )
}

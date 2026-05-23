import React from 'react'
import { FileText, Image, X, FileIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatFileSize } from '../../utils/fileHelpers'

export default function FilePreview({ files, onRemove }) {
  if (!files?.length) return null

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        padding: '8px 0',
        flexShrink: 0,
      }}
    >
      {files.map((file, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'relative',
            flexShrink: 0,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}
        >
          {file.type?.startsWith('image') ? (
            <img
              src={file.preview || file.base64 || URL.createObjectURL(file)}
              alt={file.name}
              style={{ width: 72, height: 72, objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div
              style={{
                width: 72,
                height: 72,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: 8,
              }}
            >
              <FileText size={22} color="var(--primary-color)" />
              <span style={{ fontSize: 9, color: 'var(--text-tertiary)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 60 }}>
                {file.name}
              </span>
            </div>
          )}

          {/* Remove button */}
          <button
            onClick={() => onRemove(i)}
            style={{
              position: 'absolute',
              top: 3,
              right: 3,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.7)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
            }}
          >
            <X size={10} />
          </button>
        </motion.div>
      ))}
    </div>
  )
}

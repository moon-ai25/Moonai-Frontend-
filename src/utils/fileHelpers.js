/**
 * Convert file to base64
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (e) => reject(e)
  })
}

/**
 * Format bytes to human-readable size
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/**
 * Get file type category
 */
export function getFileType(file) {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type === 'application/pdf') return 'pdf'
  if (file.type.includes('word')) return 'doc'
  if (file.type.includes('text')) return 'text'
  return 'file'
}

/**
 * Build message content from text + attachments
 */
export async function buildMessageContent(text, attachments) {
  if (!attachments?.length) return text

  let content = text
  for (const att of attachments) {
    if (att.type === 'image') {
      content += `\n\n[Image: ${att.name}]\n${att.base64 || ''}`
    } else {
      content += `\n\n[File: ${att.name} (${att.size})]`
    }
  }
  return content
}

/**
 * Max file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024

/**
 * Accepted file types for dropzone
 */
export const ACCEPTED_FILE_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
}

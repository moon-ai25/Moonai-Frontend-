import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.error
      || error?.response?.data?.message
      || error?.message
      || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

/* ─── Auth ─────────────────────────────────────────── */

export const login = (identifier, password) =>
  api.post('/api/login', { identifier, password }).then((r) => r.data)

export const register = (username, email, password) =>
  api.post('/api/register1', { username, email, password }).then((r) => r.data)

export const saveGoogleUser = (name, email, picture) => {
  console.debug('[API] saveGoogleUser called with:', { name, email, picture: picture?.slice(0, 30) + '...' })
  return api.post('/api/save-google-user', { name, email, picture }).then((r) => {
    console.debug('[API] saveGoogleUser response:', r.data)
    return r.data
  })
}

export const saveTempUser = (username) =>
  api.post('/api/save-tempuser', { username }).then((r) => r.data)

/* ─── Chat ──────────────────────────────────────────── */

export const sendChat = (messages, signal) =>
  api.post('/api/chat', { messages }, { signal }).then((r) => r.data)

export const saveChat = (userId, username, title, messages, folder) =>
  api.post('/api/save-chat', { userId, username, title, messages, folder }).then((r) => r.data)

export const getChatsByUsername = (username) =>
  api.get(`/api/chats-by-username/${username}`).then((r) => r.data)

export const getChatByQuery = (username, title) =>
  api.get('/api/chat', { params: { username, title } }).then((r) => r.data)

export const getChatById = (username, chatId) =>
  api.get(`/api/chat/${username}/${chatId}`).then((r) => r.data)

export const deleteChat = (username, title) =>
  api.post('/api/delete-chat', { username, title }).then((r) => r.data)

export const renameChat = (username, oldTitle, newTitle) =>
  api.post('/api/rename-chat', { username, oldTitle, newTitle }).then((r) => r.data)

export const shareChat = (username, title) =>
  api.post('/api/share-chat', { username, title }).then((r) => r.data)

export const getSharedChat = (id) =>
  api.get(`/shared/${id}`).then((r) => r.data)

export const regenerateChat = (username, title) =>
  api.post('/api/chat/regenerate', { username, title }).then((r) => r.data)

export const submitFeedback = (username, chatId, messageIndex, feedback) =>
  api.post('/api/chat/feedback', { username, chatId, messageIndex, feedback }).then((r) => r.data)

export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return api.post('/api/upload-image-ocr', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)
}

/* ─── Tools & Search ────────────────────────────────── */

export const fixGrammar = (text) =>
  api.post('/api/fix-grammar', { text }).then((r) => r.data)

export const enhancePrompt = (text) =>
  api.post('/api/enhance-prompt', { text }).then((r) => r.data)

export const webSearch = (query, username, chatTitle) =>
  api.post('/api/web-search', { query, username, chatTitle }).then((r) => r.data)

/* ─── User / System ─────────────────────────────────── */

export const getFolders = (username) =>
  api.get(`/api/folders/${username}`).then((r) => r.data)

export const ping = (username, isTemp = false) =>
  api.post('/api/ping', { username, isTemp }).then((r) => r.data).catch(() => {})

export const getSystemMessages = () =>
  api.get('/api/messagesss').then((r) => r.data)

/* ─── Title generation ──────────────────────────────── */

export const generateTitle = (firstUserMessage) =>
  api
    .post('/api/chat', {
      messages: [
        {
          role: 'user',
          content: `Generate a short 3-5 word title for this conversation. Reply with ONLY the title, nothing else: "${firstUserMessage.slice(0, 200)}"`,
        },
      ],
    })
    .then((r) => r.data?.reply?.trim().replace(/['"]/g, '').slice(0, 60) || 'New Chat')

export default api

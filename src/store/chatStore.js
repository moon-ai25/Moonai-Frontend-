import { create } from 'zustand'

const useChatStore = create((set, get) => ({
  // ─── Auth ───────────────────────────────────────
  user: null,
  setUser: (user) => set({ user }),

  // ─── Chat session ────────────────────────────────
  messages: [],
  currentChatId: null,
  currentTitle: null,
  isGenerating: false,
  isSidebarOpen: localStorage.getItem('sidebarOpen') !== 'false',
  isSidePanelOpen: false,
  isTempChat: false,
  activeCode: null, // { code, language, title, chatId }

  setMessages: (messages) => set({ messages }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateLastMessage: (content) =>
    set((s) => {
      const msgs = [...s.messages]
      if (msgs.length > 0) {
        msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content }
      }
      return { messages: msgs }
    }),
  replaceMessageAt: (index, msg) =>
    set((s) => {
      const msgs = [...s.messages]
      msgs[index] = msg
      return { messages: msgs.slice(0, index + 1) }
    }),

  setCurrentChatId: (id) => set({ currentChatId: id }),
  setCurrentTitle: (title) => set({ currentTitle: title }),
  setGenerating: (v) => set({ isGenerating: v }),
  setTempChat: (v) => set({ isTempChat: v }),

  toggleSidebar: () =>
    set((s) => {
      const next = !s.isSidebarOpen
      localStorage.setItem('sidebarOpen', String(next))
      return { isSidebarOpen: next }
    }),
  setSidebarOpen: (v) => {
    localStorage.setItem('sidebarOpen', String(v))
    set({ isSidebarOpen: v })
  },
  setSidePanelOpen: (v) => set({ isSidePanelOpen: v }),
  setActiveCode: (codeObj) => set({ activeCode: codeObj, isSidePanelOpen: !!codeObj }),
  closeSidePanel: () => set({ isSidePanelOpen: false, activeCode: null }),

  // ─── Chat list ───────────────────────────────────
  chatList: [],
  isLoadingChats: false,
  setChatList: (chatList) => set({ chatList }),
  setLoadingChats: (v) => set({ isLoadingChats: v }),
  addChatToList: (chat) =>
    set((s) => ({ chatList: [chat, ...s.chatList] })),
  removeChatFromList: (title) =>
    set((s) => ({ chatList: s.chatList.filter((c) => c.title !== title) })),
  renameChatInList: (oldTitle, newTitle, newId = null) =>
    set((s) => ({
      chatList: s.chatList.map((c) =>
        c.title === oldTitle ? { ...c, title: newTitle, ...(newId ? { _id: newId, chatId: newId } : {}) } : c
      ),
    })),
  moveChatToTop: (title) =>
    set((s) => {
      const chatIndex = s.chatList.findIndex((c) => c.title === title)
      if (chatIndex <= 0) return { chatList: s.chatList } // Already at top or not found
      const chat = { ...s.chatList[chatIndex], updatedAt: new Date().toISOString() }
      const newChatList = [chat, ...s.chatList.slice(0, chatIndex), ...s.chatList.slice(chatIndex + 1)]
      return { chatList: newChatList }
    }),

  // ─── Pinned messages ─────────────────────────────
  pinnedMessages: [],
  setPinnedMessages: (pins) => set({ pinnedMessages: pins }),
  togglePin: (chatId, msg) =>
    set((s) => {
      const key = `pinned_${chatId}`
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      const alreadyPinned = existing.some((p) => p.id === msg.id)
      const next = alreadyPinned
        ? existing.filter((p) => p.id !== msg.id)
        : [...existing, msg]
      localStorage.setItem(key, JSON.stringify(next))
      return { pinnedMessages: next }
    }),

  // ─── Search ──────────────────────────────────────
  isSearchOpen: false,
  searchQuery: '',
  searchMatches: [],
  searchIndex: 0,
  setSearchOpen: (v) => set({ isSearchOpen: v }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSearchMatches: (m) => set({ searchMatches: m }),
  setSearchIndex: (i) => set({ searchIndex: i }),

  // ─── Focus mode ──────────────────────────────────
  isFocusMode: false,
  toggleFocusMode: () => set((s) => ({ isFocusMode: !s.isFocusMode })),

  // ─── Theme & Appearance ──────────────────────────
  theme: localStorage.getItem('theme') || 'dark',
  primaryColor: localStorage.getItem('primaryColor') || '#e94d9b',
  isSettingsOpen: false,
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },
  setPrimaryColor: (color) => {
    localStorage.setItem('primaryColor', color)
    set({ primaryColor: color })
  },
  setSettingsOpen: (v) => set({ isSettingsOpen: v }),

  // ─── New chat ────────────────────────────────────
  newChat: () =>
    set({
      messages: [],
      currentChatId: null,
      currentTitle: null,
      isGenerating: false,
      searchQuery: '',
      searchMatches: [],
      searchIndex: 0,
    }),

  // ─── Side Panel Size ─────────────────────────────
  sidePanelWidth: Number(localStorage.getItem('sidePanelWidth')) || 650,
  setSidePanelWidth: (w) => {
    localStorage.setItem('sidePanelWidth', String(w))
    set({ sidePanelWidth: w })
  },
}))

export default useChatStore

import { useCallback } from 'react'
import useChatStore from '../store/chatStore'

export default function useSearch() {
  const {
    searchQuery,
    searchMatches,
    searchIndex,
    isSearchOpen,
    messages,
    setSearchOpen,
    setSearchQuery,
    setSearchMatches,
    setSearchIndex,
  } = useChatStore()

  const openSearch = useCallback(() => setSearchOpen(true), [setSearchOpen])
  const closeSearch = useCallback(() => {
    setSearchOpen(false)
    setSearchQuery('')
    setSearchMatches([])
    setSearchIndex(0)
  }, [setSearchOpen, setSearchQuery, setSearchMatches, setSearchIndex])

  const search = useCallback(
    (query) => {
      setSearchQuery(query)
      if (!query.trim()) {
        setSearchMatches([])
        setSearchIndex(0)
        return
      }
      const lower = query.toLowerCase()
      const matches = messages
        .map((m, i) => ({ index: i, id: m.id, content: m.content }))
        .filter((m) => m.content?.toLowerCase().includes(lower))
      setSearchMatches(matches)
      setSearchIndex(0)
    },
    [messages, setSearchQuery, setSearchMatches, setSearchIndex]
  )

  const next = useCallback(() => {
    if (!searchMatches.length) return
    setSearchIndex((searchIndex + 1) % searchMatches.length)
  }, [searchMatches, searchIndex, setSearchIndex])

  const prev = useCallback(() => {
    if (!searchMatches.length) return
    setSearchIndex((searchIndex - 1 + searchMatches.length) % searchMatches.length)
  }, [searchMatches, searchIndex, setSearchIndex])

  return {
    isSearchOpen,
    searchQuery,
    searchMatches,
    searchIndex,
    openSearch,
    closeSearch,
    search,
    next,
    prev,
  }
}

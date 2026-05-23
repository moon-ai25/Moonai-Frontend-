/**
 * Format a date for message timestamps
 */
export function formatMessageTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) {
    return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' }) + ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

/**
 * Full timestamp for tooltip
 */
export function formatFullDate(dateStr) {
  return new Date(dateStr).toLocaleString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Group chat list items by date category
 */
export function groupChatsByDate(chats) {
  const now = new Date()
  const groups = { Today: [], Yesterday: [], 'This Week': [], Older: [] }

  chats.forEach((chat) => {
    const date = new Date(chat.updatedAt || chat.createdAt || 0)
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) groups.Today.push(chat)
    else if (diffDays === 1) groups.Yesterday.push(chat)
    else if (diffDays < 7) groups['This Week'].push(chat)
    else groups.Older.push(chat)
  })

  return groups
}

const GREETINGS_BY_TIME = [
  // 12 AM - 3 AM (0)
  ["Hey Batman", "Hey Astronaut", "Hey Dreamer", "Nighty Owl", "Midnight Soul", "Moon rises", "Deep silence", "Stars awake", "Quiet orbit", "Dark glow"],
  // 3 AM - 6 AM (1)
  ["Hello Wanderer", "Awake Soul", "Night Mind", "Moon Child", "Silent Thinker", "Heavy silence", "Slow thoughts", "Cosmic drift", "Endless night", "Dim starlight"],
  // 6 AM - 9 AM (2)
  ["Morning Star", "Early Bird", "New Day", "Bright Soul", "First Light", "Moon fading", "Soft sunrise", "Sky waking", "Light returns", "Moon went bed"],
  // 9 AM - 12 PM (3)
  ["Hello Sun", "Bright Mind", "Ready One", "Sharp Starter", "Sun active", "Moon sleeping", "Day orbit", "Energy rising", "Clear sky", "Work mode"],
  // 12 PM - 3 PM (4)
  ["Focus Mind", "Day Runner", "Strong Soul", "Sharp Thinker", "Peak Performer", "Peak light", "Heat rising", "Bright sky", "Full orbit", "Day peak"],
  // 3 PM - 6 PM (5)
  ["Steady One", "Still Going", "Focused Mind", "Day Fighter", "Calm Worker", "Slow drift", "Energy dips", "Long day", "Half fading", "Orbit steady"],
  // 6 PM - 9 PM (6)
  ["Evening Soul", "Calm Mind", "Soft One", "Night Near", "Dusk Walker", "Sun falling", "Golden sky", "Calm begins", "Day ending", "Moon rising"],
  // 9 PM - 12 AM (7)
  ["Night Soul", "Calm One", "Rest Mind", "Quiet Star", "Soft darkness", "Night mode", "Silence returns", "Dreams begin", "Stars appear", "Orbit slows"]
];

/**
 * Greeting based on time of day, changes every day
 */
export function getGreeting() {
  const now = new Date()
  const h = now.getHours()
  const timeBlock = Math.floor(h / 3)
  
  // Create a daily seed so the greeting is consistent for the whole day
  // but rotates to the next one the following day
  const dailySeed = now.getFullYear() + now.getMonth() * 31 + now.getDate()
  
  const blockGreetings = GREETINGS_BY_TIME[timeBlock]
  const index = dailySeed % blockGreetings.length
  
  return blockGreetings[index]
}

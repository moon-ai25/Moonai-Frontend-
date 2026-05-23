import React from 'react'

export default function TempChatIcon({ active, size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <g transform="translate(4.8, 1)">
        {active ? (
          <path
            fill={color}
            d="M4.469,8.156v-2.25h2.25v2.25h-2.25zM15.688,5.906h2.219v2.25h-2.219v-2.25zM20.156,12.625v-4.469h2.25v8.969h-2.25v2.219h-2.25v2.25h2.25v2.25h2.25v2.219h-4.5v-2.219h-2.219v-2.25h-8.969v2.25h-2.25v2.219h-4.469v-2.219h2.25v-2.25h2.219v-2.25h-2.219v-2.219h-2.25v-8.969h2.25v4.469h2.219v-2.219h2.25v-2.25h2.25v2.25h4.469v-2.25h2.25v2.25h2.219v2.219h2.25zM8.969,14.875v-2.25h-2.25v2.25h2.25zM15.688,14.875v-2.25h-2.25v2.25h2.25z"
          />
        ) : (
          <path
            fill="transparent"
            stroke={color}
            strokeWidth="1.1"
            d="M4.469,8.156v-2.25h2.25v2.25h-2.25zM15.688,5.906h2.219v2.25h-2.219v-2.25zM20.156,12.625v-4.469h2.25v8.969h-2.25v2.219h-2.25v2.25h2.25v2.25h2.25v2.219h-4.5v-2.219h-2.219v-2.25h-8.969v2.25h-2.25v2.219h-4.469v-2.219h2.25v-2.25h2.219v-2.25h-2.219v-2.219h-2.25v-8.969h2.25v4.469h2.219v-2.219h2.25v-2.25h2.25v2.25h4.469v-2.25h2.25v2.25h2.219v2.219h2.25zM8.969,14.875v-2.25h-2.25v2.25h2.25zM15.688,14.875v-2.25h-2.25v2.25h2.25z"
          />
        )}
      </g>
    </svg>
  )
}

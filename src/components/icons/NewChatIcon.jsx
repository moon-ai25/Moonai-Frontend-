import React from 'react'

export default function NewChatIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}>
      <path
        d="M20.1497,7.94L8.2797,19.81C7.2197,20.88 4.0497,21.37 3.2797,20.66C2.5097,19.95 3.0697,16.78 4.1297,15.71L15.9997,3.84C16.5478,3.318 17.2783,3.031 18.0351,3.0402C18.7919,3.0494 19.5151,3.3542 20.0503,3.8894C20.5855,4.4246 20.8903,5.1478 20.8995,5.9046C20.9088,6.6615 20.6217,7.3919 20.0997,7.94H20.1497Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21,21H12"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

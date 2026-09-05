import React from 'react'

export default function TermsPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
      <h1 style={{ color: 'var(--accent-primary)', marginBottom: '20px' }}>Terms of Service</h1>
      
      <h2>1. Terms of Service</h2>
      <p>Welcome to Moon AI. By accessing or using our application, you agree to be bound by these terms. Moon AI provides an AI-powered conversational interface. You agree not to misuse the service or help anyone else do so.</p>
      
      <h2 style={{ marginTop: '20px' }}>2. User Responsibilities</h2>
      <p>You are responsible for the activity that happens on or through your account. Please do not share sensitive personal information (such as passwords, credit card numbers, or social security numbers) with the AI.</p>
      
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-medium)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Last updated: September 2026
      </div>
    </div>
  )
}

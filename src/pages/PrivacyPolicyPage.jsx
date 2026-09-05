import React from 'react'

export default function PrivacyPolicyPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
      <h1 style={{ color: 'var(--accent-primary)', marginBottom: '20px' }}>Privacy Policy</h1>
      
      <h2>1. Information We Collect</h2>
      <p>Your privacy is important to us. Moon AI respects your privacy and is committed to protecting your personal data. We collect information you provide directly to us when you create an account, such as your name and email, and when you interact with the AI.</p>
      
      <h2 style={{ marginTop: '20px' }}>2. How We Use Your Data</h2>
      <p>We use the data we collect to provide and improve our services, including to train and refine our AI models. We do not sell your personal data to third parties.</p>
      
      <h2 style={{ marginTop: '20px' }}>3. Data Security</h2>
      <p>We use industry-standard security measures, including encryption and secure servers, to protect your information from unauthorized access, disclosure, or destruction.</p>
      
      <h2 style={{ marginTop: '20px' }}>4. Your Rights</h2>
      <p>You have the right to access, update, or delete your personal information. If you wish to delete your account and all associated data, you may do so through the app settings or by contacting our support team.</p>
      
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-medium)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Last updated: September 2026
      </div>
    </div>
  )
}

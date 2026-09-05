import React, { useEffect } from 'react'

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.body.classList.add('scrollable-page')
    return () => document.body.classList.remove('scrollable-page')
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
      {/* Top Header */}
      <header style={{ padding: '24px 40px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ 
            fontFamily: "'Pixelify Sans', var(--font-display)", 
            fontSize: '32px', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary-color) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Moon AI
          </h1>
        </a>
      </header>

      {/* Content */}
      <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}>
        <h1 style={{ color: 'var(--accent-primary)', marginBottom: '32px', fontSize: '2.5rem' }}>Privacy Policy</h1>
        
        <p style={{ fontSize: '1.1rem', marginBottom: '24px', color: 'var(--text-secondary)' }}>
          Last updated: September 2026
        </p>

        <p>
          At Moon AI, accessible from moonai.zylapse.com, one of our main priorities is the privacy of our visitors and users. This Privacy Policy document contains types of information that is collected and recorded by Moon AI and how we use it.
        </p>
        
        <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>1. Information We Collect</h2>
        <p>
          The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
        </p>
        <p>
          <strong>Account Information:</strong> When you register for an Account, we may ask for your contact information, including items such as name, username, and email address.
        </p>
        <p>
          <strong>Usage Data:</strong> We may collect data regarding your interaction with our AI models, including text inputs, feedback ratings (likes/dislikes), and device information such as IP address and browser type. This helps us optimize the user experience and improve the AI models.
        </p>

        <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>2. How We Use Your Information</h2>
        <p>We use the information we collect in various ways, including to:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}>Provide, operate, and maintain our website and AI services</li>
          <li style={{ marginBottom: '8px' }}>Improve, personalize, and expand our platform</li>
          <li style={{ marginBottom: '8px' }}>Understand and analyze how you use our platform</li>
          <li style={{ marginBottom: '8px' }}>Develop new products, services, features, and functionality</li>
          <li style={{ marginBottom: '8px' }}>Communicate with you for customer service, updates, and other information relating to the platform</li>
          <li style={{ marginBottom: '8px' }}>Find and prevent fraud</li>
        </ul>

        <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>3. Log Files</h2>
        <p>
          Moon AI follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and it is a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
        </p>

        <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>4. Data Security</h2>
        <p>
          We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. We employ industry-standard encryption protocols for data transmission and secure servers for storage. However, remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
        </p>

        <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>5. Third-Party Privacy Policies</h2>
        <p>
          Moon AI's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of any third-party services integrated within our platform (such as authentication providers) for more detailed information.
        </p>

        <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>6. GDPR & CCPA Data Protection Rights</h2>
        <p>
          We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
        </p>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
          <li style={{ marginBottom: '8px' }}><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
          <li style={{ marginBottom: '8px' }}><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
          <li style={{ marginBottom: '8px' }}><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
        </ul>
        <p>
          If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
        </p>

        <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid var(--border-medium)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
        </div>
      </main>
    </div>
  )
}

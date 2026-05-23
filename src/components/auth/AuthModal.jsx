import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useAuth from '../../hooks/useAuth'
import useChatStore from '../../store/chatStore'

// --- Custom Google Icon SVG ---
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

// --- Particle Logo Component ---
const ParticleLogo = ({ isDarkMode }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const particles = useRef([]);

  const PARTICLE_COUNT = 2800;
  const REPEL_RADIUS = 120;
  const RESTORE_STRENGTH = 0.08;
  const FRICTION = 0.85;

  class Particle {
    constructor(canvasWidth, canvasHeight) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.logoX = this.x;
      this.logoY = this.y;
      this.vx = 0;
      this.vy = 0;
      this.size = Math.random() * 1.5 + 0.5;
    }

    setLogoPos(x, y) {
      this.logoX = x;
      this.logoY = y;
    }

    update(mx, my) {
      const dx = mx - this.x;
      const dy = my - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < REPEL_RADIUS) {
        const angle = Math.atan2(dy, dx);
        const force = (REPEL_RADIUS - distance) / REPEL_RADIUS;
        this.vx -= Math.cos(angle) * force * 15;
        this.vy -= Math.sin(angle) * force * 15;
      }

      const rdx = this.logoX - this.x;
      const rdy = this.logoY - this.y;
      this.vx += rdx * RESTORE_STRENGTH;
      this.vy += rdy * RESTORE_STRENGTH;

      this.vx *= FRICTION;
      this.vy *= FRICTION;

      this.x += this.vx;
      this.y += this.vy;
    }

    draw(ctx, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      particles.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.current.push(new Particle(w, h));
      }

      loadLogo(w, h);
    };

    const loadLogo = (width, height) => {
      const img = new Image();
      img.src = "/moon.svg";
      img.onload = () => {
        const baseWidth = 1024;
        const baseHeight = 1024;
        // Significantly increased scale for a larger logo
        const scale = Math.min(width * 1.0, 500) / baseWidth;
        const offsetX = (width - baseWidth * scale) / 2;
        const offsetY = (height - baseHeight * scale) / 2;

        const offscreen = document.createElement('canvas');
        const ow = Math.ceil(baseWidth);
        const oh = Math.ceil(baseHeight);
        offscreen.width = ow;
        offscreen.height = oh;
        const oCtx = offscreen.getContext('2d');
        oCtx.drawImage(img, 0, 0, ow, oh);

        const imageData = oCtx.getImageData(0, 0, ow, oh).data;
        const pts = [];

        for (let y = 0; y < oh; y += 4) {
          for (let x = 0; x < ow; x += 4) {
            if (imageData[(y * ow + x) * 4 + 3] > 80) {
              pts.push({ x, y });
            }
          }
        }

        if (pts.length > 0) {
          particles.current.forEach(p => {
            const pt = pts[Math.floor(Math.random() * pts.length)];
            p.setLogoPos(pt.x * scale + offsetX, pt.y * scale + offsetY);
          });
        }
      };
    };

    const animate = () => {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const color = isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)';

      particles.current.forEach(p => {
        p.update(mouse.current.x, mouse.current.y);
        p.draw(ctx, color);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    setTimeout(init, 50);
    animate();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDarkMode]);

  const handleMouseLeave = () => {
    mouse.current = { x: -1000, y: -1000 };
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  return (
    <div
      ref={containerRef}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ width: '100%', height: '100%', cursor: 'default', position: 'relative' }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

export default function AuthModal() {
  const { theme } = useChatStore()
  const isDarkMode = theme === 'dark'
  const { loginWithGoogle } = useAuth()

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isHoveringBtn, setIsHoveringBtn] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Initialize Google Auth — always re-initialize so the callback stays fresh
  useEffect(() => {
    const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!clientID) {
      console.warn('[Google Auth] VITE_GOOGLE_CLIENT_ID is not set!')
      return
    }

    const init = () => {
      if (!window.google?.accounts?.id) {
        console.warn('[Google Auth] window.google not ready yet, retrying in 500ms...')
        setTimeout(init, 500)
        return
      }

      console.debug('[Google Auth] Initializing with client_id:', clientID.slice(0, 20) + '...')
      window.google.accounts.id.initialize({
        client_id: clientID,
        callback: loginWithGoogle,
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      console.debug('[Google Auth] ✅ Initialized successfully')
    }

    init()
  }, [loginWithGoogle])

  const handleCustomGoogleClick = () => {
    const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!window.google?.accounts?.id) {
      console.error('[Google Auth] Google GSI not loaded yet')
      return
    }
    if (!clientID) {
      console.error('[Google Auth] No client ID configured')
      return
    }
    // Re-initialize to ensure the latest callback, then prompt
    window.google.accounts.id.initialize({
      client_id: clientID,
      callback: loginWithGoogle,
      auto_select: false,
      cancel_on_tap_outside: true,
    })
    window.google.accounts.id.prompt((notification) => {
      console.debug('[Google Auth] Prompt notification:', notification.getMomentType?.())
      if (notification.isNotDisplayed()) {
        console.warn('[Google Auth] Prompt not displayed. Reason:', notification.getNotDisplayedReason?.())
      }
      if (notification.isSkippedMoment()) {
        console.warn('[Google Auth] Prompt skipped. Reason:', notification.getSkippedReason?.())
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        background: isDarkMode ? '#000000' : '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Left side / Top side: Particle Logo */}
      <div style={{
        flex: 1.2,
        position: 'relative',
        width: '100%',
        height: isMobile ? '45vh' : '100%'
      }}>
        <ParticleLogo isDarkMode={isDarkMode} />
      </div>

      {/* Right side / Bottom side: Login Content positioned to the right */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: isMobile ? 'center' : 'flex-end', // Aligned to the right end
        padding: isMobile ? '20px 24px 60px' : '0 100px 0 0',
      }}>

        {/* Dark Gray Glass Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            width: '100%',
            maxWidth: '440px',
            background: isDarkMode ? 'rgba(12, 12, 12, 0.65)' : 'rgba(244, 244, 245, 0.65)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            borderRadius: '32px',
            padding: isMobile ? '40px 32px' : '56px 48px',
            boxShadow: isDarkMode ? '0 32px 64px rgba(0,0,0,0.4)' : '0 32px 64px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ marginBottom: 40 }}>
            <h1 style={{
              fontSize: isMobile ? '36px' : '44px',
              lineHeight: '1.15',
              marginBottom: '16px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em'
            }}>
              <span style={{ fontWeight: 400 }}>Intelligence,</span><br />
              <span style={{ fontWeight: 700 }}>Simplified.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              Log in and make things happen.
            </p>
          </div>

          {/* Custom Styled Google Button */}
          <button
            onClick={handleCustomGoogleClick}
            onMouseEnter={() => setIsHoveringBtn(true)}
            onMouseLeave={() => setIsHoveringBtn(false)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: isDarkMode ? '#ffffff' : '#000000',
              color: isDarkMode ? '#000000' : '#ffffff',
              border: 'none',
              borderRadius: '16px',
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '24px',
              transition: 'transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease',
              transform: isHoveringBtn ? 'scale(0.98)' : 'scale(1)',
              opacity: isHoveringBtn ? 0.9 : 1,
              boxShadow: isHoveringBtn
                ? 'none'
                : (isDarkMode ? '0 8px 24px rgba(255,255,255,0.15)' : '0 8px 24px rgba(0,0,0,0.15)')
            }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{
              color: 'var(--text-tertiary)',
              fontSize: '12px',
              lineHeight: '1.5'
            }}>
              By continuing, you agree to our Terms of Service.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
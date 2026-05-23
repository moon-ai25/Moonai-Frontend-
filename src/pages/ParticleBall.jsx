import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const ParticleBall = ({ isDarkMode }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const particles = useRef([]);
  const [mode, setMode] = useState('ball'); // 'ball' | 'logo'
  const transitionProgress = useRef({ value: 0 }); // 0 = ball, 1 = logo
  const logoPointsLoaded = useRef(false);

  const PARTICLE_COUNT = 6000;
  const REPEL_RADIUS = 120;
  const RESTORE_STRENGTH = 0.05;
  const FRICTION = 0.88;

  class Particle {
    constructor(canvasWidth, canvasHeight, radius) {
      // 1. BALL POSITION (Spherical)
      const phi = Math.random() * Math.PI * 2;
      const costheta = Math.random() * 2 - 1;
      const u = Math.random();
      const theta = Math.acos(costheta);
      const r = radius * Math.cbrt(u);

      this.ballX = canvasWidth / 2 + r * Math.sin(theta) * Math.cos(phi);
      this.ballY = canvasHeight / 2 + r * Math.sin(theta) * Math.sin(phi);
      
      // 2. LOGO POSITION (Default to ball pos until loaded)
      this.logoX = this.ballX;
      this.logoY = this.ballY;

      // Current target base (will be interpolated)
      this.x = this.ballX + (Math.random() - 0.5) * 100;
      this.y = this.ballY + (Math.random() - 0.5) * 100;
      this.vx = 0;
      this.vy = 0;
      this.size = Math.random() * 1.5 + 0.5;
    }

    setLogoPos(x, y) {
      this.logoX = x;
      this.logoY = y;
    }

    update(mx, my, t) {
      const targetBaseX = this.ballX * (1 - t) + this.logoX * t;
      const targetBaseY = this.ballY * (1 - t) + this.logoY * t;

      const dx = mx - this.x;
      const dy = my - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < REPEL_RADIUS) {
        const angle = Math.atan2(dy, dx);
        const force = (REPEL_RADIUS - distance) / REPEL_RADIUS;
        this.vx -= Math.cos(angle) * force * 15;
        this.vy -= Math.sin(angle) * force * 15;
      }

      const rdx = targetBaseX - this.x;
      const rdy = targetBaseY - this.y;
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

      const radius = Math.min(w * 0.35, 250);
      
      particles.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.current.push(new Particle(w, h, radius));
      }
      
      loadLogo(w, h);
    };

    const loadLogo = (width, height) => {
      const img = new Image();
      img.src = "zylapse_logo.svg"; 
      img.onload = () => {
        const baseWidth = 376.861;
        const baseHeight = 311;
        // Keep logo compact
        const scale = Math.min(width * 0.45, 400) / baseWidth;
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
        for (let y = 0; y < oh; y++) {
          for (let x = 0; x < ow; x++) {
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
          logoPointsLoaded.current = true;
        }
      };
    };

    const animate = () => {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      ctx.clearRect(0, 0, w, h);
      
      const color = isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)';
      const t = transitionProgress.current.value;
      
      particles.current.forEach(p => {
        p.update(mouse.current.x, mouse.current.y, t);
        p.draw(ctx, color);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouse.current = { x: -1000, y: -1000 };
    };

    init();
    animate();

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDarkMode]);

  const toggleMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    gsap.to(transitionProgress.current, {
      value: newMode === 'logo' ? 1 : 0,
      duration: 1.5,
      ease: "power3.inOut"
    });
  };

  return (
    <section 
      ref={containerRef}
      className={`relative w-full h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000 ${isDarkMode ? 'bg-black' : 'bg-[#F4F4F0]'}`}
    >
      <div className="absolute top-12 z-20 flex flex-col items-center gap-6">
        <p className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>
          [ 03 ] Form Evolution
        </p>
        
        <div className={`flex p-1 rounded-full border transition-colors duration-500 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          <button 
            onClick={() => toggleMode('ball')}
            className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
              mode === 'ball' 
                ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') 
                : (isDarkMode ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black')
            }`}
          >
            Neural Ball
          </button>
          <button 
            onClick={() => toggleMode('logo')}
            className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
              mode === 'logo' 
                ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') 
                : (isDarkMode ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black')
            }`}
          >
            Zylapse Logo
          </button>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-none"
      />
      
      <div className="absolute bottom-12 right-12 z-10 pointer-events-none text-right">
        <p className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>
          Sub-atomic particle morphing<br/>
          Dynamic shape synthesis
        </p>
      </div>
    </section>
  );
};

export default ParticleBall;

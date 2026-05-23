import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

export { gsap }

/**
 * Page entrance animation — sidebar, header, input bar
 */
export function pageEntranceTimeline() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from('.sidebar-animate', {
    x: -260,
    opacity: 0,
    duration: 0.6,
  })
    .from('.chat-header-animate', {
      y: -40,
      opacity: 0,
      duration: 0.4,
    }, '-=0.3')
    .from('.floating-input-animate', {
      y: 60,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.4)',
    }, '-=0.2')

  return tl
}

/**
 * Typing indicator dots — staggered yoyo
 */
export function typingDotsAnimation(containerEl) {
  const dots = containerEl?.querySelectorAll('.typing-dot')
  if (!dots?.length) return null

  const tl = gsap.to(dots, {
    scaleY: 1.6,
    duration: 0.4,
    ease: 'power1.inOut',
    stagger: 0.15,
    repeat: -1,
    yoyo: true,
  })

  return tl
}

/**
 * Voice recording pulse rings
 */
export function voiceRecordingPulse(containerEl) {
  const rings = containerEl?.querySelectorAll('.pulse-ring')
  if (!rings?.length) return null

  const tl = gsap.to(rings, {
    scale: 2.5,
    opacity: 0,
    duration: 1.2,
    stagger: 0.3,
    repeat: -1,
    ease: 'power2.out',
  })

  return tl
}

/**
 * Welcome screen logo entrance — scale + rotation
 */
export function welcomeLogoEntrance(logoEl) {
  if (!logoEl) return null

  return gsap.from(logoEl, {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.2,
  })
}

/**
 * Suggestion cards stagger entrance
 */
export function suggestionCardsStagger(containerEl) {
  const cards = containerEl?.querySelectorAll('.suggestion-card')
  if (!cards?.length) return null

  return gsap.from(cards, {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
    delay: 0.5,
  })
}

/**
 * Search overlay entrance
 */
export function searchOverlayEntrance(overlayEl) {
  if (!overlayEl) return null

  return gsap.from(overlayEl, {
    y: -20,
    opacity: 0,
    duration: 0.25,
    ease: 'power2.out',
  })
}

/**
 * Smooth scroll to element using GSAP
 */
export function smoothScrollTo(containerEl, targetEl) {
  if (!containerEl || !targetEl) return

  gsap.to(containerEl, {
    scrollTop: targetEl.offsetTop - 80,
    duration: 0.6,
    ease: 'power2.inOut',
  })
}

/**
 * Highlight flash on a target element
 */
export function highlightFlash(el) {
  if (!el) return

  const tl = gsap.timeline()
  tl.to(el, {
    background: 'rgba(124, 58, 237, 0.25)',
    duration: 0.15,
    ease: 'power2.out',
  }).to(el, {
    background: 'transparent',
    duration: 0.8,
    ease: 'power2.inOut',
  })

  return tl
}

/**
 * Sidebar collapse animation
 */
export function sidebarCollapse(el, collapse = true) {
  return gsap.to(el, {
    width: collapse ? 0 : 260,
    opacity: collapse ? 0 : 1,
    duration: 0.35,
    ease: 'power3.inOut',
  })
}

/**
 * New message scroll button entrance
 */
export function newMessageBtnEntrance(el) {
  return gsap.from(el, {
    y: 20,
    opacity: 0,
    duration: 0.2,
    ease: 'power2.out',
  })
}

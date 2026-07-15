import { useState, useEffect, useRef } from 'react'

// rAF 기반 throttle — 스크롤 이벤트 성능 최적화
function rafThrottle(fn) {
  let ticking = false
  return function (...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn.apply(this, args)
        ticking = false
      })
      ticking = true
    }
  }
}

/**
 * Intersection Observer 기반 뷰포트 진입 감지
 * @returns [ref, inView]
 */
export function useInView({ threshold = 0.15, rootMargin = '0px', once = true } = {}) {
  const ref     = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) obs.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView]
}

/**
 * rAF throttle 적용 스크롤 Y 위치
 */
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handle = rafThrottle(() => setScrollY(window.scrollY))
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return scrollY
}

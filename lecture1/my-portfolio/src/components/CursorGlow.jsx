import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

const MAG_R = 88
const MAG_S = 0.30

const DOT_HOVER = {
  bg:     '#22C55E',
  shadow: '0 0 8px rgba(34,197,94,0.9), 0 0 18px rgba(34,197,94,0.35)',
}
const DOT_DARK = {
  bg:     '#FFFFFF',
  shadow: '0 0 6px rgba(255,255,255,0.8), 0 0 14px rgba(255,255,255,0.25)',
}
const DOT_LIGHT = {
  bg:     '#09090B',
  shadow: '0 0 4px rgba(0,0,0,0.25)',
}

export default function CursorGlow() {
  const { isDark } = useTheme()

  const dotRef    = useRef(null)
  const hov       = useRef(false)
  const prevHov   = useRef(false)
  const isDarkRef = useRef(isDark)   // rAF 루프에서 최신 isDark 참조
  const mouse     = useRef({ x: -300, y: -300 })

  // isDark 변경 시 ref 동기화 + 도트 색상 즉시 반영
  useEffect(() => {
    isDarkRef.current = isDark
    if (!dotRef.current || prevHov.current) return
    const c = isDark ? DOT_DARK : DOT_LIGHT
    dotRef.current.style.background = c.bg
    dotRef.current.style.boxShadow  = c.shadow
  }, [isDark])

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const styleEl = document.createElement('style')
    styleEl.textContent = '*, *::before, *::after { cursor: none !important; }'
    document.head.appendChild(styleEl)

    const onMove = (e) => {
      let x = e.clientX, y = e.clientY
      let minD = MAG_R, pull = null
      document.querySelectorAll('button, a').forEach(el => {
        const rc = el.getBoundingClientRect()
        const cx = rc.left + rc.width  / 2
        const cy = rc.top  + rc.height / 2
        const d  = Math.hypot(x - cx, y - cy)
        if (d < minD) { minD = d; pull = { cx, cy, d } }
      })
      if (pull) {
        const f = (1 - pull.d / MAG_R) * MAG_S
        x += (pull.cx - x) * f
        y += (pull.cy - y) * f
      }
      mouse.current = { x, y }
    }

    const onOver = (e) => { hov.current = !!e.target.closest('button, a') }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)

    let frame
    const tick = () => {
      const { x: mx, y: my } = mouse.current
      const isH = hov.current

      if (isH !== prevHov.current) {
        prevHov.current = isH
        const c = isH ? DOT_HOVER : (isDarkRef.current ? DOT_DARK : DOT_LIGHT)
        if (dotRef.current) {
          dotRef.current.style.background = c.bg
          dotRef.current.style.boxShadow  = c.shadow
        }
      }

      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${mx - 4}px,${my - 4}px,0)`

      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      document.head.removeChild(styleEl)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <div ref={dotRef} style={{
      position: 'fixed', top: 0, left: 0, zIndex: 9999,
      width: 8, height: 8, borderRadius: '50%',
      background: isDark ? '#FFFFFF' : '#09090B',
      pointerEvents: 'none', willChange: 'transform',
      transform: 'translate3d(-999px,-999px,0)',
      transition: 'background 0.28s ease, box-shadow 0.28s ease',
      boxShadow: isDark
        ? '0 0 6px rgba(255,255,255,0.8), 0 0 14px rgba(255,255,255,0.25)'
        : '0 0 4px rgba(0,0,0,0.25)',
    }} />
  )
}

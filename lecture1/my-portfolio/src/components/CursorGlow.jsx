import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      el.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`
      el.style.opacity = '1'
    }
    const onLeave = () => { el.style.opacity = '0' }
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, rgba(34,197,94,0.02) 45%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        willChange: 'transform, opacity',
        transition: 'transform 0.12s ease, opacity 0.3s ease',
        transform: 'translate(-999px, -999px)',
      }}
    />
  )
}

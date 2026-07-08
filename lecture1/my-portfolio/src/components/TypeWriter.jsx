import { useEffect, useRef, useState } from 'react'

/**
 * Intersection Observer로 뷰포트 진입 시 타이핑 애니메이션 시작
 * @param {string}  text    - 타이핑할 텍스트
 * @param {number}  speed   - 글자당 딜레이(ms)
 * @param {number}  delay   - 시작 전 대기(ms)
 * @param {boolean} cursor  - 커서 표시 여부
 */
export default function TypeWriter({ text, speed = 55, delay = 0, cursor = true }) {
  const wrapRef  = useRef(null)
  const [chars,  setChars]   = useState('')
  const [done,   setDone]    = useState(false)
  const [started, setStarted] = useState(false)

  // 뷰포트 진입 감지
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // 타이핑 실행
  useEffect(() => {
    if (!started) return
    setChars('')
    setDone(false)
    let i = 0

    const tid = setTimeout(() => {
      const iv = setInterval(() => {
        i++
        setChars(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(iv)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(iv)
    }, delay)

    return () => clearTimeout(tid)
  }, [started, text, speed, delay])

  return (
    <span ref={wrapRef}>
      {chars}
      {cursor && !done && (
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: '2px',
            height: '0.85em',
            background: 'currentColor',
            marginLeft: '2px',
            verticalAlign: 'middle',
            animation: 'tw-blink 0.7s step-end infinite',
          }}
        />
      )}
      <style>{`
        @keyframes tw-blink {
          0%, 100% { opacity: 1 }
          50%       { opacity: 0 }
        }
      `}</style>
    </span>
  )
}

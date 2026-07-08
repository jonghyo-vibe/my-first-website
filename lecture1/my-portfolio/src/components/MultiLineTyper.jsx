import { useState, useEffect } from 'react'

/**
 * Hero용 타이핑 효과 — 여러 문구를 순서대로 타이핑 → 삭제 → 반복
 * 탭이 숨겨지면 자동 일시정지, 활성화 시 재개
 */
export default function MultiLineTyper({
  phrases     = [],
  typeSpeed   = 75,   // ms/글자
  deleteSpeed = 40,   // ms/글자
  holdMs      = 2000, // 완성 후 대기
  cursor      = true,
}) {
  const [text,   setText]   = useState('')
  const [phase,  setPhase]  = useState('typing')   // 'typing' | 'deleting'
  const [idx,    setIdx]    = useState(0)
  const [paused, setPaused] = useState(false)

  // 탭 가시성 변경 → 일시정지/재개
  useEffect(() => {
    const fn = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', fn)
    return () => document.removeEventListener('visibilitychange', fn)
  }, [])

  useEffect(() => {
    if (paused || phrases.length === 0) return
    const target = phrases[idx]

    if (phase === 'typing') {
      if (text.length < target.length) {
        const t = setTimeout(
          () => setText(target.slice(0, text.length + 1)),
          typeSpeed
        )
        return () => clearTimeout(t)
      }
      // 완성 → 대기 후 삭제
      const t = setTimeout(() => setPhase('deleting'), holdMs)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (text.length > 0) {
        const t = setTimeout(
          () => setText(prev => prev.slice(0, -1)),
          deleteSpeed
        )
        return () => clearTimeout(t)
      }
      // 삭제 완료 → 다음 문구
      setIdx(i => (i + 1) % phrases.length)
      setPhase('typing')
    }
  }, [text, phase, idx, paused, phrases, typeSpeed, deleteSpeed, holdMs])

  return (
    <span>
      {text}
      {cursor && (
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 2,
            height: '0.85em',
            background: 'currentColor',
            marginLeft: 3,
            verticalAlign: 'middle',
            animation: 'mlt-blink 0.7s step-end infinite',
          }}
        />
      )}
      <style>{`@keyframes mlt-blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </span>
  )
}

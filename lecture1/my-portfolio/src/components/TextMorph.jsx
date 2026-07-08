import { useState, useEffect } from 'react'

/**
 * 글자 단위 블러 모핑 — 단어가 바뀔 때 각 글자가 개별적으로 블러인 됨
 * "개발자" → "디자이너" → "크리에이터" 반복
 */
export default function TextMorph({ words, interval = 2200, style = {} }) {
  const [curIdx,  setCurIdx]  = useState(0)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setAnimKey(k => k + 1)
      setCurIdx(i => (i + 1) % words.length)
    }, interval)
    return () => clearInterval(t)
  }, [words.length, interval])

  const word = words[curIdx]

  return (
    <span style={{ display: 'inline-block', ...style }}>
      {word.split('').map((char, i) => (
        <span
          key={`${animKey}-${i}`}
          style={{
            display: 'inline-block',
            animation: `charMorphIn 0.48s ease ${i * 0.06}s both`,
          }}
        >
          {char}
        </span>
      ))}
      <style>{`
        @keyframes charMorphIn {
          from {
            filter: blur(8px);
            opacity: 0;
            transform: translateY(-10px) scale(1.25);
          }
          to {
            filter: blur(0);
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </span>
  )
}

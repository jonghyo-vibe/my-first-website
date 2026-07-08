import { useEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'

const R    = 36
const CIRC = 2 * Math.PI * R

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default function CircularSkillProgress({ skill, color, visible, index }) {
  const circleRef = useRef(null)
  const numRef    = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    if (!visible) return
    const delay    = index * 60
    const duration = 550 + index * 30
    let startTime  = null

    const tid = setTimeout(() => {
      const animate = (now) => {
        if (startTime === null) startTime = now
        const p     = Math.min((now - startTime) / duration, 1)
        const eased = easeOutCubic(p)
        const lvl   = eased * skill.level

        if (circleRef.current)
          circleRef.current.style.strokeDashoffset = CIRC * (1 - lvl / 100)
        if (numRef.current)
          numRef.current.textContent = `${Math.round(lvl)}%`

        if (p < 1) rafRef.current = requestAnimationFrame(animate)
      }
      rafRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(tid)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [visible, skill.level, index])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.8 }}>
      <Box sx={{ position: 'relative', width: 86, height: 86 }}>
        <svg width="86" height="86" viewBox="0 0 86 86" style={{ overflow: 'visible' }}>
          {/* 트랙 */}
          <circle cx="43" cy="43" r={R} fill="none" style={{ stroke: 'var(--c-border)' }} strokeWidth="5" />
          {/* 프로그래스 */}
          <circle
            ref={circleRef}
            cx="43" cy="43" r={R}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
            transform="rotate(-90 43 43)"
            style={{ filter: `drop-shadow(0 0 5px ${color}55)` }}
          />
        </svg>
        <Box sx={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 0.2,
        }}>
          <skill.Icon sx={{ fontSize: 14, color }} />
          <Typography ref={numRef} sx={{ fontSize: 11, fontWeight: 800, color, lineHeight: 1 }}>
            0%
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'var(--c-sub)', textAlign: 'center' }}>
        {skill.name}
      </Typography>
    </Box>
  )
}

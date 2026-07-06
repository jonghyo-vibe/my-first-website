import { useEffect, useState, useRef } from 'react'
import { Box, Typography, Button, Stack, Chip } from '@mui/material'
import { Link } from 'react-router-dom'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ContactSection from '../components/ContactSection'

/* ── 컬러 토큰 ── */
const C = {
  bg:      '#0A0A0A',
  surface: '#111111',
  border:  '#1E1E1E',
  green:   '#22C55E',
  sky:     '#38BDF8',
  white:   '#FFFFFF',
  muted:   '#666666',
  sub:     '#999999',
}

const SYNE = "'Syne', sans-serif"

const TECH = [
  'React', 'TypeScript', 'JavaScript', 'HTML/CSS',
  'Supabase', 'Node.js', 'Figma', 'Git',
]

const STATS = [
  { num: '2+',   label: '프로젝트 완성',    color: C.green },
  { num: '100%', label: '노력으로 성장 중',  color: C.sky   },
  { num: '∞',    label: '성장 가능성',       color: C.white },
]

/* ────────────────────────────────────────── */
export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const infoRef  = useRef(null)
  const [infoVisible, setInfoVisible] = useState(false)

  /* 스크롤 트래킹 */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Info 섹션 Intersection Observer */
  useEffect(() => {
    const el = infoRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInfoVisible(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* 패럴랙스 값 계산 */
  const imgTranslate  = scrollY * 0.45
  const nameOpacity   = Math.max(0, 1 - scrollY * 0.004)
  const nameTranslate = -scrollY * 0.25
  const scrollHint    = Math.max(0, 1 - scrollY * 0.012)

  /* 오버레이 점점 어두워짐 */
  const overlay1 = Math.min(0.55, 0.15 + scrollY * 0.0008)
  const overlay2 = Math.min(0.98, 0.50 + scrollY * 0.0015)

  return (
    <Box sx={{ bgcolor: C.bg, minHeight: '100vh' }}>

      {/* ═══════════════════════════════════════
          SECTION 1 — 풀스크린 사진
      ═══════════════════════════════════════ */}
      <Box sx={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* 패럴랙스 이미지 */}
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1440&h=1800&fit=crop&q=90"
          alt="profile"
          sx={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: '130%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            transform: `translateY(${imgTranslate}px)`,
            willChange: 'transform',
            userSelect: 'none',
          }}
        />

        {/* 그라디언트 오버레이 */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(
            to bottom,
            rgba(10,10,10,${overlay1}) 0%,
            rgba(10,10,10,${overlay1 * 0.7}) 40%,
            rgba(10,10,10,${overlay2}) 100%
          )`,
          transition: 'background 0.05s',
        }} />

        {/* 사이드 그린 라인 (포인트) */}
        <Box sx={{
          position: 'absolute', left: 0, top: '15%', bottom: '15%',
          width: 3,
          bgcolor: C.green,
          opacity: nameOpacity * 0.7,
        }} />

        {/* 이름 + 직함 */}
        <Box sx={{
          position: 'absolute',
          bottom: '12%', left: 0, right: 0,
          px: { xs: 4, md: 10 },
          opacity: nameOpacity,
          transform: `translateY(${nameTranslate}px)`,
          willChange: 'transform, opacity',
        }}>
          <Typography sx={{
            fontFamily: SYNE,
            fontSize: { xs: '4.5rem', sm: '7rem', md: '10rem' },
            fontWeight: 800,
            color: C.white,
            letterSpacing: -4,
            lineHeight: 0.9,
            textTransform: 'uppercase',
          }}>
            JONGHYO
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Box sx={{ width: 40, height: 2, bgcolor: C.green }} />
            <Typography sx={{
              fontFamily: SYNE,
              fontSize: { xs: '0.85rem', md: '1.1rem' },
              color: C.green,
              letterSpacing: 6,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>
              Growth Marketer
            </Typography>
          </Box>
        </Box>

        {/* 스크롤 힌트 */}
        <Box sx={{
          position: 'absolute',
          bottom: 28, right: { xs: 24, md: 48 },
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          opacity: scrollHint,
        }}>
          <Typography sx={{
            fontSize: 9, color: C.muted,
            letterSpacing: 4, fontFamily: SYNE,
            writingMode: 'vertical-rl',
          }}>
            SCROLL DOWN
          </Typography>
          <Box sx={{
            width: 1, height: 48,
            bgcolor: C.green, opacity: 0.5,
            animation: 'scrollLine 1.8s ease-in-out infinite',
          }} />
        </Box>
      </Box>


      {/* ═══════════════════════════════════════
          SECTION 2 — 개인 정보 (스크롤 시 등장)
      ═══════════════════════════════════════ */}
      <Box
        ref={infoRef}
        sx={{
          bgcolor: C.bg,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 3, sm: 5, md: 10 },
          py: { xs: 8, md: 12 },
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <Box sx={{
          maxWidth: 1100, mx: 'auto', width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: { xs: 6, md: 10 },
          alignItems: 'center',
          opacity: infoVisible ? 1 : 0,
          transform: infoVisible ? 'translateY(0)' : 'translateY(60px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>

          {/* ── 왼쪽: 헤드라인 ── */}
          <Box>
            {/* 뱃지 */}
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              border: `1px solid ${C.border}`,
              borderRadius: 5, px: 2, py: 0.6, mb: 4,
              bgcolor: '#111',
            }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: C.green, animation: 'pulse 2s infinite' }} />
              <Typography sx={{ fontSize: 10, color: C.sub, letterSpacing: 3, fontFamily: SYNE }}>
                OPEN TO WORK
              </Typography>
            </Box>

            {/* 헤드라인 */}
            <Typography sx={{
              fontFamily: SYNE,
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
              fontWeight: 800,
              color: C.white,
              lineHeight: 1.1,
              letterSpacing: -1,
            }}>
              데이터로 생각하고,
            </Typography>
            <Typography sx={{
              fontFamily: SYNE,
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
              fontWeight: 800,
              color: C.sky,
              lineHeight: 1.1,
              letterSpacing: -1,
              mb: 1,
            }}>
              코드로 실행합니다.
            </Typography>
            <Box sx={{ width: 60, height: 3, bgcolor: C.green, mb: 3, borderRadius: 2 }} />

            {/* 설명 */}
            <Typography sx={{
              fontSize: { xs: 14, md: 16 },
              color: C.muted,
              lineHeight: 2,
              mb: 5,
              maxWidth: 520,
            }}>
              디자인 감각과 기술적 깊이를 갖춘 그로스 마케터입니다.
              <br />
              차분하게, 하지만 확실하게 목표를 달성합니다.
            </Typography>

            {/* CTA 버튼 */}
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button
                component={Link} to="/projects"
                variant="contained"
                sx={{
                  bgcolor: C.green,
                  color: '#000 !important',
                  fontWeight: 700,
                  px: 4, py: 1.5,
                  borderRadius: 2,
                  fontFamily: SYNE,
                  fontSize: 14,
                  '&:hover': { bgcolor: '#16A34A' },
                }}
              >
                포트폴리오 보기
              </Button>
              <Button
                component={Link} to="/about"
                variant="outlined"
                sx={{
                  borderColor: C.border,
                  color: `${C.sub} !important`,
                  fontWeight: 600,
                  px: 4, py: 1.5,
                  borderRadius: 2,
                  fontFamily: SYNE,
                  fontSize: 14,
                  '&:hover': {
                    borderColor: C.sky,
                    color: `${C.sky} !important`,
                    bgcolor: 'rgba(56,189,248,0.05)',
                  },
                }}
              >
                About Me
              </Button>
            </Stack>
          </Box>

          {/* ── 오른쪽: 스탯 카드 ── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {STATS.map(({ num, label, color }, i) => (
              <Box
                key={label}
                sx={{
                  bgcolor: C.surface,
                  borderRadius: 3,
                  p: { xs: 2.5, md: 3 },
                  border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', gap: 3,
                  opacity: infoVisible ? 1 : 0,
                  transform: infoVisible ? 'translateX(0)' : 'translateX(40px)',
                  transition: `opacity 0.7s ease ${0.2 + i * 0.15}s, transform 0.7s ease ${0.2 + i * 0.15}s`,
                  '&:hover': {
                    borderColor: color,
                    boxShadow: `0 0 20px ${color}20`,
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  },
                }}
              >
                <Typography sx={{
                  fontFamily: SYNE,
                  fontSize: { xs: '2rem', md: '2.8rem' },
                  fontWeight: 800,
                  color,
                  lineHeight: 1,
                  minWidth: 80,
                }}>
                  {num}
                </Typography>
                <Box>
                  <Typography sx={{ color: C.white, fontSize: 14, fontWeight: 600, mb: 0.3 }}>
                    {label}
                  </Typography>
                  <Box sx={{ width: 32, height: 2, bgcolor: color, borderRadius: 1 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>


      {/* ═══════════════════════════════════════
          SECTION 3 — 기술 스택
      ═══════════════════════════════════════ */}
      <TechSection />


      {/* ═══════════════════════════════════════
          SECTION 4 — Contact
      ═══════════════════════════════════════ */}
      <ContactSection />

      {/* 글로벌 애니메이션 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; opacity: 1; }
          50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }
      `}</style>
    </Box>
  )
}


/* ── 기술 스택 섹션 컴포넌트 ── */
function TechSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Box
      ref={ref}
      sx={{
        bgcolor: C.surface,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        py: 6,
        px: { xs: 3, md: 8 },
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Typography sx={{
          fontSize: 10, fontWeight: 700, letterSpacing: 4,
          color: C.muted, textTransform: 'uppercase',
          textAlign: 'center', mb: 3,
          fontFamily: SYNE,
        }}>
          Tech Stack
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, justifyContent: 'center' }}>
          {TECH.map((tech, i) => (
            <Chip
              key={tech}
              label={tech}
              sx={{
                bgcolor: 'transparent',
                color: C.sub,
                border: `1px solid ${C.border}`,
                fontWeight: 600,
                fontSize: 12,
                fontFamily: SYNE,
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 0.06}s`,
                '&:hover': {
                  bgcolor: 'rgba(34,197,94,0.08)',
                  borderColor: C.green,
                  color: C.green,
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

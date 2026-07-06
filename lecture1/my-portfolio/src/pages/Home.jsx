import { useEffect, useState, useRef } from 'react'
import { Box, Typography, Button, Stack, Avatar, Tooltip, LinearProgress } from '@mui/material'
import { Link } from 'react-router-dom'
import SchoolIcon       from '@mui/icons-material/School'
import WorkIcon         from '@mui/icons-material/Work'
import PaletteIcon      from '@mui/icons-material/Palette'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ContactSection from '../components/ContactSection'
import { usePortfolio, CAT_COLORS } from '../context/PortfolioContext'

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

const INFO_ITEMS = [
  { Icon: SchoolIcon,  key: 'education',  label: '학력' },
  { Icon: PaletteIcon, key: 'major',      label: '전공' },
  { Icon: WorkIcon,    key: 'experience', label: '경력' },
]

/* ────────────────────────────────────────── */
export default function Home() {
  const { homeData }     = usePortfolio()
  const storySection     = homeData.content[0]
  const { basicInfo }    = homeData

  const [scrollY, setScrollY]       = useState(0)
  const infoRef                     = useRef(null)
  const [infoVisible, setInfoVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const imgTranslate  = scrollY * 0.45
  const nameOpacity   = Math.max(0, 1 - scrollY * 0.004)
  const nameTranslate = -scrollY * 0.25
  const scrollHint    = Math.max(0, 1 - scrollY * 0.012)
  const overlay1      = Math.min(0.55, 0.15 + scrollY * 0.0008)
  const overlay2      = Math.min(0.98, 0.50 + scrollY * 0.0015)

  return (
    <Box sx={{ bgcolor: C.bg, minHeight: '100vh' }}>

      {/* ═══════════════════════════════════════
          SECTION 1 — 풀스크린 사진
      ═══════════════════════════════════════ */}
      <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1440&h=1800&fit=crop&q=90"
          alt="profile"
          sx={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '130%',
            objectFit: 'cover', objectPosition: 'center 20%',
            transform: `translateY(${imgTranslate}px)`,
            willChange: 'transform', userSelect: 'none',
          }}
        />
        <Box sx={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, rgba(10,10,10,${overlay1}) 0%, rgba(10,10,10,${overlay1 * 0.7}) 40%, rgba(10,10,10,${overlay2}) 100%)`,
          transition: 'background 0.05s',
        }} />
        <Box sx={{ position: 'absolute', left: 0, top: '15%', bottom: '15%', width: 3, bgcolor: C.green, opacity: nameOpacity * 0.7 }} />

        <Box sx={{
          position: 'absolute', bottom: '12%', left: 0, right: 0,
          px: { xs: 4, md: 10 },
          opacity: nameOpacity,
          transform: `translateY(${nameTranslate}px)`,
          willChange: 'transform, opacity',
        }}>
          <Typography sx={{
            fontFamily: SYNE,
            fontSize: { xs: '4.5rem', sm: '7rem', md: '10rem' },
            fontWeight: 800, color: C.white, letterSpacing: -4, lineHeight: 0.9, textTransform: 'uppercase',
          }}>
            JONGHYO
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Box sx={{ width: 40, height: 2, bgcolor: C.green }} />
            <Typography sx={{
              fontFamily: SYNE, fontSize: { xs: '0.85rem', md: '1.1rem' },
              color: C.green, letterSpacing: 6, fontWeight: 600, textTransform: 'uppercase',
            }}>
              Growth Marketer
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          position: 'absolute', bottom: 28, right: { xs: 24, md: 48 },
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          opacity: scrollHint,
        }}>
          <Typography sx={{ fontSize: 9, color: C.muted, letterSpacing: 4, fontFamily: SYNE, writingMode: 'vertical-rl' }}>
            SCROLL DOWN
          </Typography>
          <Box sx={{ width: 1, height: 48, bgcolor: C.green, opacity: 0.5, animation: 'scrollLine 1.8s ease-in-out infinite' }} />
        </Box>
      </Box>


      {/* ═══════════════════════════════════════
          SECTION 2 — 개발 스토리 + 프로필 카드
      ═══════════════════════════════════════ */}
      <Box
        ref={infoRef}
        sx={{
          bgcolor: C.bg, minHeight: '100vh',
          display: 'flex', alignItems: 'center',
          px: { xs: 3, sm: 5, md: 10 },
          py: { xs: 8, md: 12 },
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <Box sx={{
          maxWidth: 1100, mx: 'auto', width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: { xs: 6, md: 10 }, alignItems: 'center',
          opacity: infoVisible ? 1 : 0,
          transform: infoVisible ? 'translateY(0)' : 'translateY(60px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>

          {/* ── 왼쪽: 개발 스토리 ── */}
          <Box>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              border: `1px solid ${C.border}`, borderRadius: 5, px: 2, py: 0.6, mb: 4, bgcolor: '#111',
            }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: C.green, animation: 'pulse 2s infinite' }} />
              <Typography sx={{ fontSize: 10, color: C.sub, letterSpacing: 3, fontFamily: SYNE }}>
                OPEN TO WORK
              </Typography>
            </Box>

            <Typography sx={{
              fontFamily: SYNE, fontSize: 11, fontWeight: 700,
              color: C.green, letterSpacing: 4, textTransform: 'uppercase', mb: 1,
            }}>
              {storySection?.title ?? '나의 개발 스토리'}
            </Typography>
            <Typography sx={{
              fontFamily: SYNE,
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.4rem' },
              fontWeight: 800, color: C.white, lineHeight: 1.15, letterSpacing: -1, mb: 1,
            }}>
              {basicInfo.name}
            </Typography>
            <Box sx={{ width: 60, height: 3, bgcolor: C.green, mb: 3, borderRadius: 2 }} />

            <Typography sx={{
              fontSize: { xs: 14, md: 16 }, color: C.muted, lineHeight: 2, mb: 5, maxWidth: 520,
            }}>
              {storySection?.summary || 'About Me 탭에서 개발 스토리를 작성해보세요.'}
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button
                component={Link} to="/about"
                variant="contained"
                sx={{
                  bgcolor: C.green, color: '#000 !important', fontWeight: 700,
                  px: 4, py: 1.5, borderRadius: 2, fontFamily: SYNE, fontSize: 14,
                  '&:hover': { bgcolor: '#16A34A' },
                }}
              >
                더 알아보기
              </Button>
              <Button
                component={Link} to="/projects"
                variant="outlined"
                sx={{
                  borderColor: C.sky, color: `${C.sky} !important`,
                  fontWeight: 700, px: 4, py: 1.5, borderRadius: 2, fontFamily: SYNE, fontSize: 14,
                  '&:hover': { bgcolor: 'rgba(56,189,248,0.12)', borderColor: C.sky },
                }}
              >
                포트폴리오 보기
              </Button>
            </Stack>
          </Box>

          {/* ── 오른쪽: 프로필 카드 ── */}
          <Box
            sx={{
              bgcolor: C.surface, borderRadius: 3, p: 3,
              border: `1px solid ${C.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5,
              opacity: infoVisible ? 1 : 0,
              transform: infoVisible ? 'translateX(0)' : 'translateX(40px)',
              transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s, border-color 0.3s, box-shadow 0.3s',
              '&:hover': { borderColor: C.green, boxShadow: `0 0 24px ${C.green}18` },
            }}
          >
            <Avatar
              src={basicInfo.photo}
              sx={{
                width: 88, height: 88,
                bgcolor: '#1A1A1A', border: `2px solid ${C.border}`,
                fontSize: '2rem', fontWeight: 700, color: C.green,
              }}
            >
              {!basicInfo.photo && basicInfo.name?.[0]}
            </Avatar>
            <Typography sx={{ fontFamily: SYNE, fontSize: '1.5rem', fontWeight: 800, color: C.white }}>
              {basicInfo.name}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
              {INFO_ITEMS.map(({ Icon, key, label }, i) => (
                <Box
                  key={key}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    opacity: infoVisible ? 1 : 0,
                    transform: infoVisible ? 'translateX(0)' : 'translateX(20px)',
                    transition: `opacity 0.5s ease ${0.4 + i * 0.1}s, transform 0.5s ease ${0.4 + i * 0.1}s`,
                  }}
                >
                  <Box sx={{
                    width: 30, height: 30, borderRadius: '50%',
                    bgcolor: 'rgba(34,197,94,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon sx={{ fontSize: 14, color: C.green }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                    <Typography sx={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {label}
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.sub }}>
                      {basicInfo[key]}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>


      {/* ═══════════════════════════════════════
          SECTION 3 — 주요 스킬 프리뷰
      ═══════════════════════════════════════ */}
      <SkillsPreview />


      {/* ═══════════════════════════════════════
          SECTION 4 — Contact
      ═══════════════════════════════════════ */}
      <ContactSection />

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


/* ── 주요 스킬 프리뷰 섹션 ── */
function SkillsPreview() {
  const { homeData }      = usePortfolio()
  const { topSkills }     = homeData
  const ref               = useRef(null)
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
        py: 6, px: { xs: 3, md: 8 },
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Typography sx={{
          fontSize: 10, fontWeight: 700, letterSpacing: 4,
          color: C.muted, textTransform: 'uppercase',
          textAlign: 'center', mb: 4, fontFamily: SYNE,
        }}>
          Top Skills
        </Typography>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
          gap: 2, mb: 4,
        }}>
          {topSkills.map((skill, i) => {
            const color = CAT_COLORS[skill.category] ?? C.green
            return (
              <Tooltip
                key={skill.id}
                placement="top"
                arrow
                title={
                  <Box sx={{ p: 0.5, minWidth: 170 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                        {skill.name}
                      </Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color }}>
                        {skill.level}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={skill.level}
                      sx={{
                        height: 6, borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          background: `linear-gradient(90deg, ${color}88, ${color})`,
                        },
                      }}
                    />
                    <Typography sx={{ fontSize: 10, color, mt: 0.8, letterSpacing: 1, textTransform: 'uppercase' }}>
                      {skill.category}
                    </Typography>
                  </Box>
                }
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#1A1A1A',
                      border: `1px solid ${color}44`,
                      borderRadius: 2,
                      boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
                      p: 1.5,
                    },
                  },
                  arrow: { sx: { color: '#1A1A1A' } },
                }}
              >
                <Box
                  sx={{
                    bgcolor: C.bg, border: `1px solid ${C.border}`, borderRadius: 2,
                    p: 2.5, textAlign: 'center',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.2,
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.5s ease ${i * 0.1}s, border-color 0.2s, box-shadow 0.2s`,
                    cursor: 'default',
                    '&:hover': { borderColor: color, boxShadow: `0 0 16px ${color}33` },
                  }}
                >
                  <Box sx={{
                    width: 46, height: 46, borderRadius: 2,
                    bgcolor: `${color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <skill.Icon sx={{ fontSize: 22, color }} />
                  </Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.white }}>
                    {skill.name}
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color }}>
                    {skill.level}%
                  </Typography>
                </Box>
              </Tooltip>
            )
          })}
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={Link} to="/about"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
            sx={{
              fontSize: 12, fontWeight: 600, color: C.green,
              border: `1px solid ${C.border}`, px: 3, py: 1, borderRadius: 2,
              fontFamily: SYNE,
              '&:hover': { borderColor: C.green, bgcolor: 'rgba(34,197,94,0.06)' },
            }}
          >
            전체 스킬 보기
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

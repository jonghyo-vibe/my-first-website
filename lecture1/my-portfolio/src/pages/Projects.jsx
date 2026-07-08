import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Box, Typography, Chip, Card, CardContent,
  Button, Stack, Divider, Tooltip,
} from '@mui/material'
import BlurText from '../components/BlurText'
import GitHubIcon from '@mui/icons-material/GitHub'
import CodeIcon from '@mui/icons-material/Code'
import StorageIcon from '@mui/icons-material/Storage'
import BrushIcon from '@mui/icons-material/Brush'
import SpeedIcon from '@mui/icons-material/Speed'
import BatteryFullIcon from '@mui/icons-material/BatteryFull'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import TabletIcon from '@mui/icons-material/Tablet'
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows'

const TECH_TOOLTIPS = {
  'React':        'UI 컴포넌트 라이브러리',
  'TypeScript':   '정적 타입 JavaScript',
  'Supabase':     'BaaS — 인증·DB·스토리지',
  'MUI':          'Material Design 컴포넌트',
  'Vite':         '차세대 프론트엔드 빌드 도구',
  'React Router': 'SPA 클라이언트 라우팅',
  'Tailwind CSS': '유틸리티 퍼스트 CSS 프레임워크',
  'CSS Modules':  '컴포넌트 범위 격리 CSS',
  'Storybook':    'UI 컴포넌트 개발·문서화 도구',
}

const getBadgeStyle = (label) => {
  const map = {
    'React':         { bg: '#0c1a33', color: '#60a5fa' },
    'TypeScript':    { bg: '#0f0e2a', color: '#818cf8' },
    'Supabase':      { bg: '#051a0e', color: '#4ade80' },
    'Tailwind CSS':  { bg: '#041c24', color: '#22d3ee' },
    'MUI':           { bg: '#1a0628', color: '#e879f9' },
    'Vite':          { bg: '#1a1206', color: '#fbbf24' },
    'Storybook':     { bg: '#1f0620', color: '#f0abfc' },
    'CSS Modules':   { bg: '#140828', color: '#c084fc' },
    'React Router':  { bg: '#1a060d', color: '#fb7185' },
  }
  return map[label] ?? { bg: '#0a1a10', color: '#4ade80' }
}

const DEVICE_CONFIG = {
  mobile: {
    label: 'Mobile',
    Icon: SmartphoneIcon,
    chipColor: '#134e4a',
    renderTopBar: () => (
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3,
        height: 22, bgcolor: 'rgba(4,47,46,0.78)',
        display: 'flex', alignItems: 'center', px: 1.5, justifyContent: 'space-between',
      }}>
        <Typography sx={{ fontSize: 9, color: '#5eead4', fontWeight: 600 }}>9:41</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
          <SignalCellularAltIcon sx={{ fontSize: 10, color: '#5eead4' }} />
          <BatteryFullIcon sx={{ fontSize: 10, color: '#5eead4' }} />
        </Box>
      </Box>
    ),
    renderBottomBar: () => (
      <Box sx={{
        position: 'absolute', bottom: 6, left: '50%',
        transform: 'translateX(-50%)',
        width: 36, height: 3,
        bgcolor: 'rgba(94,234,212,0.5)',
        borderRadius: 2, zIndex: 3,
      }} />
    ),
  },
  tablet: {
    label: 'Tablet',
    Icon: TabletIcon,
    chipColor: '#3b1f6b',
    renderTopBar: () => (
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3,
        height: 26, bgcolor: 'rgba(30,15,60,0.82)',
        display: 'flex', alignItems: 'center', px: 2, justifyContent: 'space-between',
      }}>
        <Typography sx={{ fontSize: 9, color: '#c4b5fd', fontWeight: 600 }}>9:41 AM</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
          <SignalCellularAltIcon sx={{ fontSize: 11, color: '#c4b5fd' }} />
          <BatteryFullIcon sx={{ fontSize: 11, color: '#c4b5fd' }} />
        </Box>
      </Box>
    ),
    renderBottomBar: () => null,
  },
  desktop: {
    label: 'Desktop',
    Icon: DesktopWindowsIcon,
    chipColor: '#78350f',
    renderTopBar: () => (
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3,
        height: 28, bgcolor: 'rgba(40,30,10,0.88)',
        display: 'flex', alignItems: 'center', px: 1.5, gap: 0.6,
      }}>
        {['#ff5f57','#ffbd2e','#28ca41'].map((c) => (
          <Box key={c} sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: c }} />
        ))}
        <Box sx={{
          ml: 1, flex: 1, height: 14, bgcolor: 'rgba(255,255,255,0.06)',
          borderRadius: 1, mx: 1,
          display: 'flex', alignItems: 'center', px: 1,
        }}>
          <Typography sx={{ fontSize: 7, color: 'rgba(251,191,36,0.65)' }}>
            localhost:5173
          </Typography>
        </Box>
      </Box>
    ),
    renderBottomBar: () => null,
  },
}

const PROJECTS = [
  {
    id: 1,
    name: '뷰테리어',
    description: '인테리어의 혁신',
    longDescription: '인테리어 아이디어를 탐색하고 공유할 수 있는 커뮤니티 플랫폼입니다. Supabase 실시간 DB와 Unsplash API를 결합해 고품질 인테리어 사진을 제공하고, React + TypeScript로 안정적인 타입 안전성을 확보했습니다.',
    device: 'desktop',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=450&fit=crop&q=80',
    github: '',
    url: 'https://jonghyo-vibe.github.io/my-first-website/mini_sns/',
    techIcons: [
      { label: 'React', Icon: CodeIcon },
      { label: 'TypeScript', Icon: SpeedIcon },
      { label: 'Supabase', Icon: StorageIcon },
    ],
    techBadges: ['Tailwind CSS', 'Vite'],
    techTexts: ['React Router DOM', 'Unsplash API'],
  },
  {
    id: 4,
    name: '미니 SNS',
    description: '소통하는 인테리어 커뮤니티',
    device: 'desktop',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=640&h=360&fit=crop&q=80',
    github: '',
    url: 'https://jongtfolio.vercel.app/',
    techIcons: [
      { label: 'React', Icon: CodeIcon },
      { label: 'Supabase', Icon: StorageIcon },
    ],
    techBadges: ['TypeScript', 'Tailwind CSS'],
    techTexts: ['React Router', 'Unsplash API'],
  },
  {
    id: 2,
    name: '그린 포트폴리오',
    description: '나만의 개발 이야기',
    device: 'tablet',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&h=360&fit=crop&q=80',
    github: '',
    techIcons: [
      { label: 'React', Icon: CodeIcon },
      { label: 'MUI', Icon: BrushIcon },
    ],
    techBadges: ['Vite', 'Supabase'],
    techTexts: ['React Router', 'Roboto Font'],
  },
  {
    id: 3,
    name: 'UI 컴포넌트',
    description: '재사용 가능한 UI 모음',
    device: 'mobile',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=640&h=360&fit=crop&q=80',
    github: '',
    techIcons: [
      { label: 'React', Icon: CodeIcon },
    ],
    techBadges: ['CSS Modules', 'Storybook'],
    techTexts: ['Vite', 'ESLint', 'Prettier'],
  },
]

/* ── 공통 훅: 틸트 + 리플 ── */
function useCardInteraction() {
  const [hovered, setHovered] = useState(false)
  const [tilt,    setTilt]    = useState({ x: 0, y: 0 })
  const [ripple,  setRipple]  = useState(null)
  const cardRef = useRef(null)

  const spawnRipple = useCallback((clientX, clientY) => {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    const key = Date.now()
    setRipple({ x: clientX - r.left, y: clientY - r.top, key })
    setTimeout(() => setRipple(null), 750)
  }, [])

  const handlers = {
    onMouseMove: useCallback((e) => {
      if (!cardRef.current) return
      const r = cardRef.current.getBoundingClientRect()
      const cx = (e.clientX - r.left) / r.width  - 0.5
      const cy = (e.clientY - r.top)  / r.height - 0.5
      setTilt({ x: cy * -10, y: cx * 10 })
    }, []),
    onMouseEnter: useCallback((e) => { setHovered(true);  spawnRipple(e.clientX, e.clientY) }, [spawnRipple]),
    onMouseLeave: useCallback(() =>   { setHovered(false); setTilt({ x: 0, y: 0 }) }, []),
    onTouchStart: useCallback((e) => { const t = e.touches[0]; setHovered(true); spawnRipple(t.clientX, t.clientY) }, [spawnRipple]),
    onTouchEnd:   useCallback(() => { setTimeout(() => { setHovered(false); setTilt({ x: 0, y: 0 }) }, 400) }, []),
  }

  return { hovered, tilt, ripple, cardRef, handlers }
}

/* ── 이미지 + 목업 영역 ── */
function MockupImage({ project, hovered, ripple, height = '56.25%' }) {
  const cfg  = DEVICE_CONFIG[project.device] ?? DEVICE_CONFIG.mobile
  const topH = project.device === 'desktop' ? 28 : project.device === 'tablet' ? 26 : 22
  return (
    <Box sx={{
      position: 'relative', width: '100%', pt: height,
      overflow: 'hidden', bgcolor: '#0d1b2a', flexShrink: 0,
    }}>
      {cfg.renderTopBar()}
      <Box
        component="img"
        src={project.image}
        alt={project.name}
        loading="lazy"
        sx={{
          position: 'absolute',
          top: topH, left: 0,
          width: '100%',
          height: `calc(100% - ${topH}px)`,
          objectFit: 'cover',
        }}
        style={{
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          filter: hovered ? 'brightness(0.72) saturate(1.3)' : 'brightness(1)',
          transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), filter 0.4s ease',
        }}
      />
      <Box sx={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 56, zIndex: 2,
        background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
      }} />
      {ripple && (
        <Box
          key={ripple.key}
          sx={{
            position: 'absolute',
            left: ripple.x - 14, top: ripple.y - 14,
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(34,197,94,0.45)',
            pointerEvents: 'none', zIndex: 6,
            '@keyframes ripple-expand': {
              '0%':   { transform: 'scale(1)', opacity: 0.8 },
              '100%': { transform: 'scale(22)', opacity: 0 },
            },
            animation: 'ripple-expand 0.75s ease-out forwards',
          }}
        />
      )}
      {project.github && (
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: 'rgba(0,0,0,0.35)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.8,
            bgcolor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 2, px: 1.5, py: 0.6,
          }}>
            <GitHubIcon sx={{ fontSize: 14, color: '#fff' }} />
            <Typography sx={{ fontSize: 11, color: '#fff', fontWeight: 600, letterSpacing: 0.5 }}>
              GitHub 열기
            </Typography>
          </Box>
        </Box>
      )}
      {cfg.renderBottomBar()}
      <Chip
        size="small"
        icon={<cfg.Icon sx={{ fontSize: '11px !important', color: '#fff !important' }} />}
        label={cfg.label}
        sx={{
          position: 'absolute', top: topH + 8, right: 8, zIndex: 3,
          fontSize: 9, height: 20,
          bgcolor: `${cfg.chipColor}cc`,
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.25)',
          '& .MuiChip-label': { px: 0.8 },
          '& .MuiChip-icon': { ml: 0.5 },
        }}
      />
    </Box>
  )
}

/* ── Featured 카드 (첫 번째 프로젝트) ── */
const FeaturedCard = ({ project, visible }) => {
  const { hovered, tilt, ripple, cardRef, handlers } = useCardInteraction()

  const handleClick = () => {
    const dest = project.url || project.github
    if (dest) window.open(dest, '_blank', 'noopener,noreferrer')
  }

  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,48px,0)',
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        willChange: 'transform, opacity',
        mb: { xs: 3, md: 4 },
      }}
    >
      <Card
        ref={cardRef}
        onClick={handleClick}
        {...handlers}
        style={{
          transform: `perspective(1400px) rotateX(${tilt.x * 0.4}deg) rotateY(${tilt.y * 0.4}deg) translateY(${hovered ? '-6px' : '0'})`,
          boxShadow: hovered
            ? '0 32px 80px rgba(34,197,94,0.22), 0 12px 32px rgba(0,0,0,0.4)'
            : '0 4px 24px rgba(0,0,0,0.2)',
        }}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: hovered ? 'rgba(34,197,94,0.5)' : 'var(--c-border)',
          bgcolor: 'var(--c-surface)',
          cursor: (project.url || project.github) ? 'pointer' : 'default',
          transition: 'border-color 0.3s ease',
          willChange: 'transform',
        }}
      >
        {/* 이미지 — 데스크탑 좌 60% */}
        <Box sx={{
          position: 'relative',
          width: { xs: '100%', md: '58%' },
          flexShrink: 0,
          overflow: 'hidden',
          minHeight: { md: 340 },
        }}>
          <MockupImage project={project} hovered={hovered} ripple={ripple} height="56.25%" />
        </Box>

        {/* 콘텐츠 — 데스크탑 우 42% */}
        <CardContent sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: { xs: 3, md: 4 },
          '&:last-child': { pb: { xs: 3, md: 4 } },
          justifyContent: 'center',
        }}>
          {/* FEATURED 뱃지 */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, alignSelf: 'flex-start',
            border: '1px solid rgba(34,197,94,0.35)', borderRadius: 5, px: 1.5, py: 0.3,
            bgcolor: 'rgba(34,197,94,0.07)',
          }}>
            <Box sx={{
              width: 5, height: 5, borderRadius: '50%', bgcolor: '#22C55E',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.3 },
              },
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <Typography sx={{ fontSize: 10, color: '#22C55E', letterSpacing: 2, fontWeight: 700 }}>
              FEATURED
            </Typography>
          </Box>

          {/* 이름 */}
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--c-text)', lineHeight: 1.15 }}>
            {project.name}
          </Typography>

          {/* 설명 */}
          <Typography sx={{ color: 'var(--c-muted)', lineHeight: 1.85, fontSize: 14 }}>
            {project.longDescription || project.description}
          </Typography>

          <Divider sx={{ borderColor: 'var(--c-border)' }} />

          {/* 기술 스택 */}
          <Stack direction="row" flexWrap="wrap" gap={0.7}>
            {project.techIcons.map(({ label, Icon }) => {
              const s = getBadgeStyle(label)
              return (
                <Tooltip key={label} title={TECH_TOOLTIPS[label] || label} arrow placement="top"
                  componentsProps={{
                    tooltip: { sx: { bgcolor: 'var(--c-surface)', border: `1px solid ${s.color}44`, fontSize: 11, color: s.color } },
                    arrow: { sx: { color: 'var(--c-surface)' } },
                  }}
                >
                  <Chip
                    icon={<Icon sx={{ fontSize: 14, color: s.color }} />}
                    label={label} size="small"
                    sx={{
                      fontSize: 11, height: 24, bgcolor: s.bg, color: s.color,
                      fontWeight: 600, border: 'none', cursor: 'default',
                      transition: 'transform 0.2s ease, box-shadow 0.25s ease',
                      '& .MuiChip-icon': { transition: 'transform 0.5s ease' },
                      '&:hover': { transform: 'scale(1.1)', boxShadow: `0 0 10px ${s.color}66` },
                      '&:hover .MuiChip-icon': { transform: 'rotate(360deg)' },
                    }}
                  />
                </Tooltip>
              )
            })}
            {project.techBadges.map((label) => {
              const s = getBadgeStyle(label)
              return (
                <Chip key={label} label={label} size="small" variant="outlined"
                  sx={{
                    fontSize: 11, height: 24, borderColor: s.color, color: s.color,
                    fontWeight: 500, cursor: 'default',
                    transition: 'transform 0.2s ease, box-shadow 0.25s ease',
                    '&:hover': { transform: 'scale(1.06)', bgcolor: `${s.color}18` },
                  }}
                />
              )
            })}
          </Stack>

          {/* 버튼 영역 */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            {project.url && (
              <Button
                variant="contained"
                onClick={(e) => { e.stopPropagation(); window.open(project.url, '_blank', 'noopener,noreferrer') }}
                sx={{
                  alignSelf: 'flex-start',
                  bgcolor: 'var(--c-green)', color: '#fff',
                  fontWeight: 600, borderRadius: 2,
                  '&:hover': { bgcolor: '#16A34A' },
                }}
              >
                사이트 보기
              </Button>
            )}
            {project.github && (
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                onClick={(e) => { e.stopPropagation(); window.open(project.github, '_blank', 'noopener,noreferrer') }}
                sx={{
                  alignSelf: 'flex-start',
                  borderColor: 'var(--c-green)', color: 'var(--c-green)',
                  fontWeight: 600, borderRadius: 2,
                  '&:hover': { bgcolor: 'var(--c-green)', color: '#fff', borderColor: 'var(--c-green)' },
                }}
              >
                GitHub
              </Button>
            )}
            {!project.url && !project.github && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'var(--c-border)' }} />
                <Typography sx={{ fontSize: 12, color: 'var(--c-muted)' }}>비공개 프로젝트</Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

/* ── 일반 프로젝트 카드 ── */
const ProjectCard = ({ project }) => {
  const [pressed, setPressed] = useState(false)
  const { hovered, tilt, ripple, cardRef, handlers } = useCardInteraction()

  const handleGithubClick = (e) => {
    e.stopPropagation()
    setPressed(true)
    setTimeout(() => setPressed(false), 300)
    window.open(project.github, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card
      ref={cardRef}
      onClick={() => { const dest = project.url || project.github; if (dest) window.open(dest, '_blank', 'noopener,noreferrer') }}
      {...handlers}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? '-8px' : '0'}) scale(${hovered ? 1.02 : 1})`,
        boxShadow: hovered
          ? '0 24px 60px rgba(34,197,94,0.28), 0 8px 24px rgba(0,0,0,0.5)'
          : '0 2px 12px rgba(0,0,0,0.25)',
      }}
      sx={{
        height: '100%', display: 'flex', flexDirection: 'column',
        borderRadius: 3, overflow: 'hidden', border: '1px solid',
        borderColor: hovered ? 'rgba(34,197,94,0.45)' : 'var(--c-border)',
        bgcolor: 'var(--c-surface)',
        cursor: project.github ? 'pointer' : 'default',
        transition: 'border-color 0.3s ease',
        willChange: 'transform',
      }}
    >
      <MockupImage project={project} hovered={hovered} ripple={ripple} />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, '&:last-child': { pb: 2 } }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--c-text)', lineHeight: 1.3, fontSize: '1rem' }}>
            {project.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--c-muted)', mt: 0.3 }}>
            {project.description}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'var(--c-border)' }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          <Stack direction="row" flexWrap="wrap" gap={0.6}>
            {project.techIcons.map(({ label, Icon }) => {
              const s = getBadgeStyle(label)
              return (
                <Tooltip key={label} title={TECH_TOOLTIPS[label] || label} arrow placement="top"
                  componentsProps={{
                    tooltip: { sx: { bgcolor: 'var(--c-surface)', border: `1px solid ${s.color}44`, borderRadius: 1.5, fontSize: 11, color: s.color } },
                    arrow: { sx: { color: 'var(--c-surface)' } },
                  }}
                >
                  <Chip
                    icon={<Icon sx={{ fontSize: 14, color: s.color }} />}
                    label={label} size="small"
                    sx={{
                      fontSize: 11, height: 22, bgcolor: s.bg, color: s.color,
                      fontWeight: 600, border: 'none', cursor: 'default',
                      willChange: 'transform, box-shadow',
                      transition: 'transform 0.2s ease, box-shadow 0.25s ease',
                      '& .MuiChip-icon': { transition: 'transform 0.5s ease' },
                      '&:hover': { transform: 'scale(1.12)', boxShadow: `0 0 10px ${s.color}88, 0 0 22px ${s.color}33` },
                      '&:hover .MuiChip-icon': { transform: 'rotate(360deg)' },
                    }}
                  />
                </Tooltip>
              )
            })}
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={0.6}>
            {project.techBadges.map((label) => {
              const s = getBadgeStyle(label)
              return (
                <Chip key={label} label={label} size="small" variant="outlined"
                  sx={{
                    fontSize: 11, height: 22, borderColor: s.color, color: s.color,
                    fontWeight: 500, cursor: 'default',
                    transition: 'transform 0.2s ease, box-shadow 0.25s ease, background-color 0.2s ease',
                    '&:hover': { transform: 'scale(1.06)', bgcolor: `${s.color}18`, boxShadow: `0 0 8px ${s.color}55` },
                  }}
                />
              )
            })}
          </Stack>

          <Typography variant="caption" sx={{ color: 'var(--c-muted)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.3 }}>
            {project.techTexts.map((t, i) => (
              <span key={t}>
                {t}
                {i < project.techTexts.length - 1 && (
                  <Box component="span" sx={{ mx: 0.4, color: 'var(--c-green)', fontWeight: 700 }}>·</Box>
                )}
              </span>
            ))}
          </Typography>
        </Box>

        {(project.url || project.github) && (
          <Box sx={{ mt: 'auto', pt: 0.5, display: 'flex', gap: 1 }}>
            {project.url && (
              <Button
                variant="contained" size="small" fullWidth
                onClick={(e) => { e.stopPropagation(); window.open(project.url, '_blank', 'noopener,noreferrer') }}
                sx={{
                  bgcolor: 'var(--c-green)', color: '#fff',
                  fontWeight: 600, fontSize: 12, py: 0.7,
                  '&:hover': { bgcolor: '#16A34A' },
                }}
              >
                사이트 보기
              </Button>
            )}
            {project.github && (
              <Button
                variant="outlined" size="small" fullWidth
                startIcon={<GitHubIcon sx={{ fontSize: '16px !important' }} />}
                onClick={handleGithubClick}
                sx={{
                  borderColor: 'var(--c-green)', color: 'var(--c-green)',
                  fontWeight: 600, fontSize: 12, py: 0.7,
                  transform: pressed ? 'scale(0.93)' : 'scale(1)',
                  transition: 'transform 0.15s cubic-bezier(0.4,0,0.2,1), background-color 0.2s, color 0.2s',
                  '&:hover': { bgcolor: 'var(--c-green)', color: '#fff', borderColor: 'var(--c-green)' },
                }}
              >
                GitHub
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

/* ── 페이지 ── */
function Projects() {
  const [headerVisible,   setHeaderVisible]   = useState(false)
  const [featuredVisible, setFeaturedVisible] = useState(false)
  const [gridVisible,     setGridVisible]     = useState(false)
  const headerRef   = useRef(null)
  const featuredRef = useRef(null)
  const gridRef     = useRef(null)

  useEffect(() => {
    const entries = [
      [headerRef.current,   setHeaderVisible,   0.3],
      [featuredRef.current, setFeaturedVisible, 0.1],
      [gridRef.current,     setGridVisible,     0.05],
    ]
    const observers = entries.map(([el, setter, threshold]) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setter(true); obs.disconnect() } },
        { threshold }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(obs => obs?.disconnect())
  }, [])

  const [featured, ...others] = PROJECTS

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'var(--c-bg)', px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, md: 6 } }}>
      {/* 헤더 */}
      <Box
        ref={headerRef}
        sx={{
          textAlign: 'center', mb: { xs: 4, md: 6 },
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translate3d(0,0,0)' : 'translate3d(0,36px,0)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          willChange: 'transform',
        }}
      >
        <Typography variant="overline" sx={{ color: '#22C55E', letterSpacing: 4, display: 'block', mb: 1 }}>
          WORK
        </Typography>
        <Typography variant="h2" sx={{ color: 'var(--c-text)', mb: 1.5, fontWeight: 800 }}>
          <BlurText text="Projects" delay={100} animateBy="chars" direction="bottom" threshold={0.2} />
        </Typography>
        <Divider sx={{ mb: 2, borderColor: '#22C55E', maxWidth: 60, mx: 'auto' }} />
        <Typography variant="body1" sx={{ color: 'var(--c-muted)' }}>
          총 {PROJECTS.length}개의 프로젝트
        </Typography>
      </Box>

      {/* Featured 카드 */}
      <Box ref={featuredRef}>
        <FeaturedCard project={featured} visible={featuredVisible} />
      </Box>

      {/* 나머지 3개 — 3열 그리드 */}
      <Typography variant="caption" sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'center', color: 'var(--c-muted)', mb: 2 }}>
        ← 좌우로 스와이프 →
      </Typography>

      <Box
        ref={gridRef}
        sx={{
          display: { xs: 'flex', sm: 'grid' },
          gridTemplateColumns: { sm: 'repeat(3, 1fr)' },
          gap: { xs: 2, sm: 3 },
          overflowX: { xs: 'auto', sm: 'visible' },
          scrollSnapType: { xs: 'x mandatory', sm: 'none' },
          pb: { xs: 2, sm: 0 },
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': { borderRadius: 2, bgcolor: 'var(--c-green)' },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        }}
      >
        {others.map((project, idx) => (
          <Box
            key={project.id}
            sx={{
              scrollSnapAlign: { xs: 'center', sm: 'none' },
              minWidth: { xs: '300px', sm: 'auto' },
              flex: { xs: '0 0 auto', sm: 'none' },
              opacity: gridVisible ? 1 : 0,
              transform: gridVisible ? 'translate3d(0,0,0)' : 'translate3d(0,52px,0)',
              transition: `opacity 0.6s ease ${idx * 0.12}s, transform 0.65s cubic-bezier(0.34,1.56,0.64,1) ${idx * 0.12}s`,
              willChange: 'transform, opacity',
            }}
          >
            <ProjectCard project={project} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Projects

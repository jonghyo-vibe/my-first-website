import { useState } from 'react'
import {
  Box, Typography, Chip, Card, CardContent,
  Button, Stack, Divider,
} from '@mui/material'
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

// device: 'mobile' | 'tablet' | 'desktop'
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
        height: 26, bgcolor: 'rgba(20,10,50,0.75)',
        display: 'flex', alignItems: 'center', px: 2, justifyContent: 'space-between',
      }}>
        <Typography sx={{ fontSize: 9, color: '#c4b5fd', fontWeight: 600 }}>9:41 AM</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SignalCellularAltIcon sx={{ fontSize: 11, color: '#c4b5fd' }} />
          <BatteryFullIcon sx={{ fontSize: 11, color: '#c4b5fd' }} />
        </Box>
      </Box>
    ),
    renderBottomBar: () => (
      <Box sx={{
        position: 'absolute', bottom: 5, left: '50%',
        transform: 'translateX(-50%)',
        width: 56, height: 3,
        bgcolor: 'rgba(196,181,253,0.5)',
        borderRadius: 2, zIndex: 3,
      }} />
    ),
  },
  desktop: {
    label: 'Desktop',
    Icon: DesktopWindowsIcon,
    chipColor: '#78350f',
    renderTopBar: () => (
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3,
        height: 28, bgcolor: 'rgba(28,17,0,0.82)',
        display: 'flex', alignItems: 'center', px: 1.5, gap: 1,
      }}>
        {/* 윈도우 제어 버튼 */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {['#ff5f57','#ffbd2e','#28ca41'].map((c) => (
            <Box key={c} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c }} />
          ))}
        </Box>
        {/* 주소창 */}
        <Box sx={{
          flex: 1, height: 14, bgcolor: 'rgba(255,255,255,0.12)',
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
    device: 'mobile',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=640&h=360&fit=crop&q=80',
    github: 'https://github.com/jonghyo-vibe',
    techIcons: [
      { label: 'React', Icon: CodeIcon },
      { label: 'TypeScript', Icon: SpeedIcon },
      { label: 'Supabase', Icon: StorageIcon },
    ],
    techBadges: ['Tailwind CSS', 'Vite'],
    techTexts: ['React Router DOM', 'Unsplash API'],
  },
  {
    id: 2,
    name: '그린 포트폴리오',
    description: '나만의 개발 이야기',
    device: 'desktop',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=640&h=360&fit=crop&q=80',
    github: 'https://github.com/jonghyo-vibe',
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
    device: 'desktop',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop&q=80',
    github: 'https://github.com/jonghyo-vibe',
    techIcons: [
      { label: 'React', Icon: CodeIcon },
    ],
    techBadges: ['CSS Modules', 'Storybook'],
    techTexts: ['Vite', 'ESLint', 'Prettier'],
  },
  {
    id: 4,
    name: '미니 SNS',
    description: '소통하는 인테리어 커뮤니티',
    device: 'tablet',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=640&h=360&fit=crop&q=80',
    github: 'https://github.com/jonghyo-vibe',
    techIcons: [
      { label: 'React', Icon: CodeIcon },
      { label: 'Supabase', Icon: StorageIcon },
    ],
    techBadges: ['TypeScript', 'Tailwind CSS'],
    techTexts: ['React Router', 'Unsplash API'],
  },
]

const ProjectCard = ({ project }) => {
  const [pressed, setPressed] = useState(false)

  const handleGithubClick = (e) => {
    e.stopPropagation()
    setPressed(true)
    setTimeout(() => setPressed(false), 300)
    window.open(project.github, '_blank', 'noopener,noreferrer')
  }

  const handleCardClick = () => {
    window.open(project.github, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'var(--color-border-default)',
        bgcolor: 'var(--color-bg-secondary)',
        cursor: 'pointer',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.02)',
          boxShadow: '0 20px 48px rgba(34,197,94,0.22)',
        },
        '&:hover .card-img': {
          transform: 'scale(1.08)',
        },
        '&:hover .card-link-hint': {
          opacity: 1,
        },
      }}
    >
      {/* ── 디바이스 목업 이미지 영역 ── */}
      {(() => {
        const cfg = DEVICE_CONFIG[project.device] ?? DEVICE_CONFIG.mobile
        const topH = project.device === 'desktop' ? 28 : project.device === 'tablet' ? 26 : 22
        return (
          <Box sx={{
            position: 'relative', width: '100%', pt: '56.25%',
            overflow: 'hidden', bgcolor: '#0d1b2a', flexShrink: 0,
          }}>
            {/* 상단 바 */}
            {cfg.renderTopBar()}

            {/* 이미지 */}
            <Box
              component="img"
              src={project.image}
              alt={project.name}
              className="card-img"
              sx={{
                position: 'absolute',
                top: topH, left: 0,
                width: '100%',
                height: `calc(100% - ${topH}px)`,
                objectFit: 'cover',
                transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}
            />

            {/* 하단 그라디언트 */}
            <Box sx={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: 48, zIndex: 2,
              background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)',
            }} />

            {/* 호버 시 링크 이동 힌트 */}
            <Box
              className="card-link-hint"
              sx={{
                position: 'absolute', inset: 0, zIndex: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.35)',
                opacity: 0,
                transition: 'opacity 0.25s ease',
              }}
            >
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

            {/* 하단 바 (홈 인디케이터 등) */}
            {cfg.renderBottomBar()}

            {/* 디바이스 타입 뱃지 */}
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
      })()}

      {/* ── 카드 콘텐츠 ── */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          p: 2,
          '&:last-child': { pb: 2 },
        }}
      >
        {/* 프로젝트 이름 + 설명 */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
              fontSize: '1rem',
            }}
          >
            {project.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mt: 0.3 }}>
            {project.description}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'var(--color-border-default)' }} />

        {/* 기술 스택 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          {/* 아이콘형 */}
          <Stack direction="row" flexWrap="wrap" gap={0.6}>
            {project.techIcons.map(({ label, Icon }) => {
              const s = getBadgeStyle(label)
              return (
                <Chip
                  key={label}
                  icon={<Icon sx={{ fontSize: 14, color: s.color }} />}
                  label={label}
                  size="small"
                  sx={{
                    fontSize: 11, height: 22,
                    bgcolor: s.bg, color: s.color,
                    fontWeight: 600,
                    border: 'none',
                  }}
                />
              )
            })}
          </Stack>

          {/* 뱃지형 */}
          <Stack direction="row" flexWrap="wrap" gap={0.6}>
            {project.techBadges.map((label) => {
              const s = getBadgeStyle(label)
              return (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: 11, height: 22,
                    borderColor: s.color,
                    color: s.color,
                    fontWeight: 500,
                  }}
                />
              )
            })}
          </Stack>

          {/* 텍스트형 */}
          <Typography
            variant="caption"
            sx={{ color: 'var(--color-text-muted)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.3 }}
          >
            {project.techTexts.map((t, i) => (
              <span key={t}>
                {t}
                {i < project.techTexts.length - 1 && (
                  <Box component="span" sx={{ mx: 0.4, color: 'var(--color-primary)', fontWeight: 700 }}>·</Box>
                )}
              </span>
            ))}
          </Typography>
        </Box>

        {/* GitHub 버튼 */}
        <Box sx={{ mt: 'auto', pt: 0.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<GitHubIcon sx={{ fontSize: '16px !important' }} />}
            onClick={handleGithubClick}
            fullWidth
            sx={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: 12,
              py: 0.7,
              transform: pressed ? 'scale(0.93)' : 'scale(1)',
              transition: 'transform 0.15s cubic-bezier(0.4,0,0.2,1), background-color 0.2s, color 0.2s',
              '&:hover': {
                bgcolor: 'var(--color-primary)',
                color: '#fff',
                borderColor: 'var(--color-primary)',
              },
            }}
          >
            GitHub
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

const Projects = () => (
  <Box
    sx={{
      minHeight: 'calc(100vh - 64px)',
      bgcolor: 'var(--color-bg-primary)',
      px: { xs: 2, sm: 4, md: 6 },
      py: { xs: 4, md: 6 },
    }}
  >
    {/* 섹션 헤더 */}
    <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
      <Typography
        variant="overline"
        sx={{ color: 'var(--color-secondary-dark)', letterSpacing: 4, display: 'block', mb: 1 }}
      >
        WORK
      </Typography>
      <Typography variant="h2" sx={{ color: 'var(--color-text-primary)', mb: 1.5 }}>
        Projects
      </Typography>
      <Divider sx={{ mb: 2, borderColor: 'var(--color-accent-sage)', maxWidth: 60, mx: 'auto' }} />
      <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
        총 {PROJECTS.length}개의 프로젝트
      </Typography>
    </Box>

    {/* 모바일 스와이프 안내 */}
    <Typography
      variant="caption"
      sx={{
        display: { xs: 'block', sm: 'none' },
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        mb: 2,
      }}
    >
      ← 좌우로 스와이프 →
    </Typography>

    {/* 그리드 / 스와이프 컨테이너 */}
    <Box
      sx={{
        display: { xs: 'flex', sm: 'grid' },
        gridTemplateColumns: {
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: { xs: 2, sm: 3 },
        overflowX: { xs: 'auto', sm: 'visible' },
        scrollSnapType: { xs: 'x mandatory', sm: 'none' },
        pb: { xs: 2, sm: 0 },
        '&::-webkit-scrollbar': { height: 4 },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 2,
          bgcolor: 'var(--color-primary)',
        },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
      }}
    >
      {PROJECTS.map((project) => (
        <Box
          key={project.id}
          sx={{
            scrollSnapAlign: { xs: 'center', sm: 'none' },
            minWidth: { xs: '300px', sm: 'auto' },
            flex: { xs: '0 0 auto', sm: 'none' },
          }}
        >
          <ProjectCard project={project} />
        </Box>
      ))}
    </Box>
  </Box>
)

export default Projects

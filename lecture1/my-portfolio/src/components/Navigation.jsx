import { useState, useEffect, useRef } from 'react'
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Drawer, List, ListItemButton, ListItemText,
  Divider,
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Home',      path: '/' },
  { label: 'About Me',  path: '/about' },
  { label: 'Projects',  path: '/projects' },
  { label: 'Contact',   path: '/contact' },
]

const GREEN = '#22C55E'

export default function Navigation() {
  const { pathname }  = useLocation()
  const [open,     setOpen]     = useState(false)   // 모바일 드로어
  const [visible,  setVisible]  = useState(true)    // 헤더 보임/숨김
  const [progress, setProgress] = useState(0)       // 스크롤 진행률
  const prevScrollY = useRef(0)

  /* ── 스크롤 감지: 방향 + 진행률 ── */
  useEffect(() => {
    const onScroll = () => {
      const cur = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight

      // 진행률 0~100
      setProgress(docH > 0 ? Math.min((cur / docH) * 100, 100) : 0)

      // 최상단이면 항상 표시
      if (cur < 10) {
        setVisible(true)
      } else {
        setVisible(cur < prevScrollY.current)   // 올릴 때만 표시
      }
      prevScrollY.current = cur
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 페이지 이동 시 맨 위로 → 헤더 표시
  useEffect(() => {
    setVisible(true)
    prevScrollY.current = 0
    setProgress(0)
  }, [pathname])

  /* ── 햄버거 아이콘 (3선 → X 애니메이션) ── */
  const LineStyle = (rotate, translateY, opacity = 1) => ({
    display: 'block',
    width: 22, height: 2,
    bgcolor: GREEN,
    borderRadius: 1,
    transition: 'transform 0.3s ease, opacity 0.2s ease',
    transform: `translateY(${translateY}px) rotate(${rotate}deg)`,
    opacity,
  })

  return (
    <>
      {/* ── AppBar ── */}
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(10,10,10,0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: 'none',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          willChange: 'transform',
        }}
      >
        {/* 진행률 바 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0, left: 0,
            height: 2,
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${GREEN}, #38BDF8)`,
            transition: 'width 0.1s linear',
          }}
        />

        <Toolbar sx={{ maxWidth: 1100, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>

          {/* 로고 */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: GREEN,
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: 1,
              whiteSpace: 'nowrap',
            }}
          >
            MY PORTFOLIO
          </Typography>

          {/* 데스크탑 메뉴 */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {navItems.map(({ label, path }) => {
              const active = pathname === path
              return (
                <Button
                  key={path}
                  component={Link}
                  to={path}
                  sx={{
                    color: active ? GREEN : '#777',
                    borderBottom: active ? `2px solid ${GREEN}` : '2px solid transparent',
                    borderRadius: 0,
                    fontWeight: active ? 700 : 400,
                    fontSize: 13,
                    letterSpacing: 0.5,
                    transition: 'color 0.2s, border-color 0.2s',
                    '&:hover': { color: GREEN },
                  }}
                >
                  {label}
                </Button>
              )
            })}
          </Box>

          {/* 모바일 햄버거 (3선 → X) */}
          <IconButton
            onClick={() => setOpen(o => !o)}
            disableRipple
            sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: '5px', p: 1 }}
          >
            <Box sx={LineStyle(open ? 45 : 0,  open ? 7  : 0)} />
            <Box sx={LineStyle(0,               0,             open ? 0 : 1)} />
            <Box sx={LineStyle(open ? -45 : 0, open ? -7 : 0)} />
          </IconButton>

        </Toolbar>
      </AppBar>

      {/* AppBar fixed라 헤더 높이만큼 아래에 여백 */}
      <Box sx={{ height: 64 }} />

      {/* ── 모바일 드로어 ── */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 240,
            bgcolor: '#0A0A0A',
            borderLeft: `1px solid ${GREEN}33`,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2 }}>
          <Typography sx={{ color: GREEN, fontWeight: 700, letterSpacing: 1, fontSize: 14 }}>
            MY PORTFOLIO
          </Typography>
          <IconButton onClick={() => setOpen(false)} sx={{ color: '#555', p: 0.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Box sx={LineStyle(45,  7)} />
              <Box sx={LineStyle(0,   0, 0)} />
              <Box sx={LineStyle(-45, -7)} />
            </Box>
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: `${GREEN}22` }} />

        <List sx={{ pt: 2 }}>
          {navItems.map(({ label, path }, i) => {
            const active = pathname === path
            return (
              <ListItemButton
                key={path}
                component={Link}
                to={path}
                onClick={() => setOpen(false)}
                sx={{
                  px: 3, py: 1.5,
                  borderLeft: active ? `3px solid ${GREEN}` : '3px solid transparent',
                  bgcolor: active ? `${GREEN}0D` : 'transparent',
                  opacity: 0,
                  animation: open ? `slideIn 0.3s ease ${i * 0.07}s forwards` : 'none',
                  '@keyframes slideIn': {
                    from: { opacity: 0, transform: 'translateX(20px)' },
                    to:   { opacity: 1, transform: 'translateX(0)' },
                  },
                  '&:hover': { bgcolor: `${GREEN}14`, borderLeftColor: GREEN },
                  transition: 'background-color 0.2s, border-color 0.2s',
                }}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    sx: {
                      color: active ? GREEN : '#888',
                      fontWeight: active ? 700 : 400,
                      fontSize: 15,
                      letterSpacing: 0.5,
                    },
                  }}
                />
              </ListItemButton>
            )
          })}
        </List>

        {/* 하단 진행률 표시 */}
        <Box sx={{ mt: 'auto', px: 3, pb: 3 }}>
          <Divider sx={{ borderColor: `${GREEN}22`, mb: 2 }} />
          <Typography sx={{ fontSize: 10, color: '#444', letterSpacing: 2, mb: 1 }}>
            SCROLL PROGRESS
          </Typography>
          <Box sx={{ height: 3, bgcolor: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{
              height: '100%',
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${GREEN}, #38BDF8)`,
              borderRadius: 2,
              transition: 'width 0.2s linear',
            }} />
          </Box>
          <Typography sx={{ fontSize: 10, color: '#555', mt: 0.5, textAlign: 'right' }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
      </Drawer>
    </>
  )
}

import { useState, useEffect, useRef } from 'react'
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Drawer, List, ListItemButton, ListItemText,
  Divider,
} from '@mui/material'
import MenuIcon    from '@mui/icons-material/Menu'
import CloseIcon   from '@mui/icons-material/Close'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { label: 'Home',      path: '/' },
  { label: 'About Me',  path: '/about' },
  { label: 'Projects',  path: '/projects' },
  { label: 'Contact',   path: '/contact' },
]

const GREEN = '#22C55E'

export default function Navigation() {
  const { pathname } = useLocation()
  const [open,     setOpen]     = useState(false)
  const [progress, setProgress] = useState(0)

  /* ── 스크롤 진행률 ── */
  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docH > 0 ? Math.min((window.scrollY / docH) * 100, 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setProgress(0)
  }, [pathname])

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: 'var(--c-nav-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: 'none',
        }}
      >
        {/* 진행률 바 */}
        <Box sx={{
          position: 'absolute',
          bottom: 0, left: 0,
          height: 2,
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${GREEN}, #38BDF8)`,
          transition: 'width 0.1s linear',
          pointerEvents: 'none',
        }} />

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
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            {navItems.map(({ label, path }) => {
              const active = pathname === path
              return (
                <Button
                  key={path}
                  component={Link}
                  to={path}
                  sx={{
                    color: active ? GREEN : 'var(--c-muted)',
                    borderBottom: active ? `2px solid ${GREEN}` : '2px solid transparent',
                    borderRadius: 0,
                    fontWeight: active ? 700 : 400,
                    fontSize: 13,
                    transition: 'color 0.2s, border-color 0.2s',
                    '&:hover': { color: GREEN },
                  }}
                >
                  {label}
                </Button>
              )
            })}
            <ThemeToggle />
          </Box>

          {/* 모바일 ThemeToggle + 햄버거 */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
          <IconButton
            onClick={() => setOpen(o => !o)}
            sx={{
              display: 'flex',
              color: GREEN,
              transition: 'transform 0.3s ease',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          </Box>

        </Toolbar>
      </AppBar>

      {/* ── 모바일 드로어 ── */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 240,
            bgcolor: 'var(--c-bg)',
            borderLeft: `1px solid ${GREEN}33`,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2 }}>
          <Typography sx={{ color: GREEN, fontWeight: 700, letterSpacing: 1, fontSize: 14 }}>
            MY PORTFOLIO
          </Typography>
          <IconButton onClick={() => setOpen(false)} sx={{ color: 'var(--c-muted)', p: 0.5 }}>
            <CloseIcon fontSize="small" />
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
                      color: active ? GREEN : 'var(--c-sub)',
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

        {/* 드로어 하단 진행률 */}
        <Box sx={{ mt: 'auto', px: 3, pb: 3 }}>
          <Divider sx={{ borderColor: `${GREEN}22`, mb: 2 }} />
          <Typography sx={{ fontSize: 10, color: 'var(--c-muted)', letterSpacing: 2, mb: 1 }}>
            SCROLL PROGRESS
          </Typography>
          <Box sx={{ height: 3, bgcolor: 'var(--c-border)', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{
              height: '100%',
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${GREEN}, #38BDF8)`,
              borderRadius: 2,
              transition: 'width 0.2s linear',
            }} />
          </Box>
          <Typography sx={{ fontSize: 10, color: 'var(--c-muted)', mt: 0.5, textAlign: 'right' }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
      </Drawer>
    </>
  )
}

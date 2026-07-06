import { useState } from 'react'
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Drawer, List, ListItemButton, ListItemText,
  Divider,
} from '@mui/material'
import MenuIcon  from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Home',      path: '/' },
  { label: 'About Me',  path: '/about' },
  { label: 'Projects',  path: '/projects' },
  { label: 'Contact',   path: '/contact' },
]

const Navigation = () => {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <AppBar position="sticky" sx={{
        background: 'rgba(10,10,10,0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 1px 0 rgba(30,30,30,0.7)',
      }}>
        <Toolbar sx={{ maxWidth: 1100, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>

          {/* 로고 */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'var(--color-accent)',
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
            {navItems.map(({ label, path }) => (
              <Button
                key={path}
                component={Link}
                to={path}
                sx={{
                  color: pathname === path ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  borderBottom: pathname === path ? '2px solid var(--color-accent)' : '2px solid transparent',
                  borderRadius: 0,
                  fontWeight: pathname === path ? 700 : 400,
                  '&:hover': { color: 'var(--color-primary-light)' },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* 모바일 햄버거 버튼 */}
          <IconButton
            onClick={() => setOpen(true)}
            sx={{ display: { xs: 'flex', sm: 'none' }, color: 'var(--color-accent)' }}
          >
            <MenuIcon />
          </IconButton>

        </Toolbar>
      </AppBar>

      {/* 모바일 드로어 */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 240,
            bgcolor: '#0D0D0D',
            borderLeft: '1px solid rgba(34,197,94,0.2)',
          },
        }}
      >
        {/* 드로어 헤더 */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2.5, py: 2,
        }}>
          <Typography sx={{
            color: '#22C55E', fontWeight: 700, letterSpacing: 1, fontSize: 14,
          }}>
            MY PORTFOLIO
          </Typography>
          <IconButton onClick={() => setOpen(false)} sx={{ color: '#555', p: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: 'rgba(34,197,94,0.15)' }} />

        {/* 메뉴 항목 */}
        <List sx={{ pt: 2 }}>
          {navItems.map(({ label, path }) => {
            const active = pathname === path
            return (
              <ListItemButton
                key={path}
                component={Link}
                to={path}
                onClick={() => setOpen(false)}
                sx={{
                  px: 3, py: 1.5,
                  borderLeft: active ? '3px solid #22C55E' : '3px solid transparent',
                  bgcolor: active ? 'rgba(34,197,94,0.06)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(34,197,94,0.08)',
                    borderLeftColor: '#22C55E',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    sx: {
                      color: active ? '#22C55E' : '#999',
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
      </Drawer>
    </>
  )
}

export default Navigation

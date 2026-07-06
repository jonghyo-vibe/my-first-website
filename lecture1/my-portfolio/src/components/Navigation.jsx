import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Home',       path: '/' },
  { label: 'About Me',  path: '/about' },
  { label: 'Projects',  path: '/projects' },
]

const Navigation = () => {
  const { pathname } = useLocation()

  return (
    <AppBar position="sticky" sx={{
      background: 'rgba(10,10,10,0.72)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 1px 0 rgba(30,30,30,0.7)',
    }}>
      <Toolbar sx={{ maxWidth: 1100, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
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
          }}
        >
          MY PORTFOLIO
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {navItems.map(({ label, path }) => (
            <Button
              key={path}
              component={Link}
              to={path}
              sx={{
                color: pathname === path
                  ? 'var(--color-accent)'
                  : 'var(--color-text-secondary)',
                borderBottom: pathname === path
                  ? '2px solid var(--color-accent)'
                  : '2px solid transparent',
                borderRadius: 0,
                fontWeight: pathname === path ? 700 : 400,
                '&:hover': { color: 'var(--color-primary-light)' },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation

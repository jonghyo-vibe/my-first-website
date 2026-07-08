import { Box } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon  from '@mui/icons-material/DarkMode'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <Box
      component="button"
      onClick={toggle}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: 52,
        height: 26,
        borderRadius: 13,
        border: '1px solid var(--c-border)',
        bgcolor: isDark ? '#1A1A2E' : '#E8F5E9',
        cursor: 'pointer',
        padding: '2px',
        background: 'none',
        outline: 'none',
        flexShrink: 0,
        '&:hover .toggle-thumb': {
          transform: isDark ? 'translateX(0) scale(1.12)' : 'translateX(26px) scale(1.12)',
        },
      }}
    >
      {/* 트랙 배경 */}
      <Box sx={{
        position: 'absolute',
        width: 50,
        height: 24,
        borderRadius: 12,
        bgcolor: isDark ? '#0D1117' : '#DCFCE7',
        transition: 'background-color 0.35s ease',
      }} />

      {/* 썸 (해/달 아이콘) */}
      <Box
        className="toggle-thumb"
        sx={{
          position: 'relative',
          zIndex: 1,
          width: 20,
          height: 20,
          borderRadius: '50%',
          bgcolor: isDark ? 'var(--c-sky)' : '#F59E0B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isDark ? 'translateX(0)' : 'translateX(26px)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), background-color 0.35s ease, box-shadow 0.35s ease',
          boxShadow: isDark
            ? '0 0 8px rgba(56,189,248,0.7)'
            : '0 0 8px rgba(245,158,11,0.7)',
          willChange: 'transform',
        }}
      >
        {isDark
          ? <DarkModeIcon  sx={{ fontSize: 12, color: '#0A0A0A' }} />
          : <LightModeIcon sx={{ fontSize: 12, color: '#0A0A0A' }} />
        }
      </Box>
    </Box>
  )
}

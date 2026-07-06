import { Box, Typography, Divider } from '@mui/material'

const Projects = () => {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-surface)',
      }}
    >
      <Box sx={{ textAlign: 'center', px: 3 }}>
        <Typography
          variant="overline"
          sx={{ color: 'var(--color-secondary)', letterSpacing: 4, display: 'block', mb: 1 }}
        >
          WORK
        </Typography>
        <Typography variant="h2" sx={{ color: 'var(--color-text-primary)', mb: 2 }}>
          Projects 페이지
        </Typography>
        <Divider sx={{ mb: 4, borderColor: 'var(--color-accent-sage)', maxWidth: 80, mx: 'auto' }} />
        <Typography
          variant="body1"
          sx={{ color: 'var(--color-text-muted)', maxWidth: 500, mx: 'auto', lineHeight: 1.8 }}
        >
          Projects 페이지가 개발될 공간입니다. 포트폴리오 작품들이 들어갈 예정입니다.
        </Typography>
      </Box>
    </Box>
  )
}

export default Projects

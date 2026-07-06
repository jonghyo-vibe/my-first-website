import { Box, Typography, Divider } from '@mui/material'

const AboutMe = () => {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-secondary)',
      }}
    >
      <Box sx={{ textAlign: 'center', px: 3 }}>
        <Typography
          variant="overline"
          sx={{ color: 'var(--color-primary)', letterSpacing: 4, display: 'block', mb: 1 }}
        >
          ABOUT
        </Typography>
        <Typography variant="h2" sx={{ color: 'var(--color-text-primary)', mb: 2 }}>
          About Me 페이지
        </Typography>
        <Divider sx={{ mb: 4, borderColor: 'var(--color-accent-sage)', maxWidth: 80, mx: 'auto' }} />
        <Typography
          variant="body1"
          sx={{ color: 'var(--color-text-muted)', maxWidth: 500, mx: 'auto', lineHeight: 1.8 }}
        >
          About Me 페이지가 개발될 공간입니다. 상세한 자기소개가 들어갈 예정입니다.
        </Typography>
      </Box>
    </Box>
  )
}

export default AboutMe

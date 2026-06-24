import { Box, Typography, Button, Divider } from '@mui/material'
import ContactSection from '../components/ContactSection'

const sectionBase = {
  width: '100%',
  maxWidth: 1100,
  mx: 'auto',
  px: { xs: 3, md: 6 },
  py: { xs: 8, md: 12 },
  textAlign: 'center',
}

const Home = () => {
  return (
    <Box>
      {/* Hero 섹션 */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, var(--color-bg-primary) 0%, #0D2040 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ ...sectionBase, color: 'var(--color-text-secondary)' }}>
          <Typography
            variant="overline"
            sx={{ color: 'var(--color-accent)', letterSpacing: 4, mb: 2, display: 'block' }}
          >
            WELCOME
          </Typography>
          <Typography
            variant="h1"
            sx={{
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary-light) 50%, var(--color-primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Hero 섹션
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--color-text-muted)', maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
            여기는 Hero 섹션입니다. 메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 5,
              background: 'var(--color-button-primary)',
              '&:hover': { background: 'var(--color-button-hover)' },
              '&:active': { background: 'var(--color-button-active)' },
              px: 5,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            더 알아보기
          </Button>
        </Box>
      </Box>

      {/* About Me 섹션 */}
      <Box sx={{ background: 'var(--color-bg-secondary)' }}>
        <Box sx={sectionBase}>
          <Typography variant="overline" sx={{ color: 'var(--color-primary)', letterSpacing: 4, display: 'block', mb: 1 }}>
            ABOUT
          </Typography>
          <Typography variant="h2" sx={{ color: 'var(--color-text-primary)', mb: 3 }}>
            About Me 섹션
          </Typography>
          <Divider sx={{ mb: 4, borderColor: 'var(--color-accent-sage)', maxWidth: 80, mx: 'auto' }} />
          <Typography variant="body1" sx={{ color: 'var(--color-text-muted)', maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
            여기는 About Me 섹션입니다. 간단한 자기소개와 '더 알아보기' 버튼이 들어갈 예정입니다.
          </Typography>
          <Button
            variant="outlined"
            size="large"
            sx={{
              mt: 4,
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              '&:hover': {
                borderColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-light)',
                background: 'rgba(0,128,255,0.05)',
              },
              px: 4,
            }}
          >
            더 알아보기
          </Button>
        </Box>
      </Box>

      {/* Skills 섹션 */}
      <Box sx={{ background: 'var(--color-bg-surface)' }}>
        <Box sx={sectionBase}>
          <Typography variant="overline" sx={{ color: 'var(--color-secondary)', letterSpacing: 4, display: 'block', mb: 1 }}>
            SKILLS
          </Typography>
          <Typography variant="h2" sx={{ color: 'var(--color-text-primary)', mb: 3 }}>
            Skills 섹션
          </Typography>
          <Divider sx={{ mb: 4, borderColor: 'var(--color-accent-sage)', maxWidth: 80, mx: 'auto' }} />
          <Typography variant="body1" sx={{ color: 'var(--color-text-muted)', maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
            여기는 Skills 섹션입니다. 기술 스택을 트리나 프로그레스바로 시각화할 예정입니다.
          </Typography>
        </Box>
      </Box>

      {/* Projects 섹션 */}
      <Box sx={{ background: 'var(--color-bg-secondary)' }}>
        <Box sx={sectionBase}>
          <Typography variant="overline" sx={{ color: 'var(--color-primary)', letterSpacing: 4, display: 'block', mb: 1 }}>
            WORK
          </Typography>
          <Typography variant="h2" sx={{ color: 'var(--color-text-primary)', mb: 3 }}>
            Projects 섹션
          </Typography>
          <Divider sx={{ mb: 4, borderColor: 'var(--color-accent-sage)', maxWidth: 80, mx: 'auto' }} />
          <Typography variant="body1" sx={{ color: 'var(--color-text-muted)', maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
            여기는 Projects 섹션입니다. 대표작 썸네일 3~4개와 '더 보기' 버튼이 들어갈 예정입니다.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 4,
              background: 'var(--color-button-primary)',
              '&:hover': { background: 'var(--color-button-hover)' },
              px: 4,
            }}
          >
            더 보기
          </Button>
        </Box>
      </Box>

      {/* Contact 섹션 */}
      <ContactSection />
    </Box>
  )
}

export default Home

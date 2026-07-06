import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, Button,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Divider, Alert, CircularProgress,
} from '@mui/material'
import InstagramIcon   from '@mui/icons-material/Instagram'
import { QRCodeSVG }   from 'qrcode.react'
import { supabase }    from '../lib/supabase'
import BlurText        from './BlurText'

const PORTFOLIO_URL = 'https://jonghyo-vibe.github.io/my-first-website/my-portfolio/'

const greenField = {
  '& label': { color: 'var(--color-text-muted)' },
  '& label.Mui-focused': { color: 'var(--color-primary-dark)' },
  '& .MuiOutlinedInput-root': {
    color: 'var(--color-text-primary)',
    '& fieldset':             { borderColor: 'var(--color-border-default)' },
    '&:hover fieldset':       { borderColor: 'var(--color-primary)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary-dark)' },
  },
  '& .MuiSelect-icon': { color: 'var(--color-text-muted)' },
}

const INIT_FORM = {
  name: '', email: '', how_found: '', rating: 0, message: '',
}

const ContactSection = () => {
  const [form,    setForm]    = useState(INIT_FORM)
  const [hover,   setHover]   = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.message) {
      setError('이름과 메시지는 필수 항목입니다!')
      return
    }
    setLoading(true)
    setError('')
    const payload = { ...form, rating: form.rating || null }
    const { error: err } = await supabase.from('guestbook').insert([payload])
    setLoading(false)
    if (err) {
      setError('저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } else {
      setSuccess(true)
      setForm(INIT_FORM)
      setTimeout(() => setSuccess(false), 5000)
    }
  }

  return (
    <Box sx={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <Box
        sx={{
          width: '100%', maxWidth: 1100, mx: 'auto',
          px: { xs: 3, md: 6 }, py: { xs: 8, md: 12 },
        }}
      >
        {/* ── 섹션 헤더 ── */}
        <Typography
          variant="overline"
          sx={{ color: 'var(--color-primary)', letterSpacing: 4, display: 'block', mb: 1, textAlign: 'center' }}
        >
          CONTACT
        </Typography>
        <Typography variant="h2" sx={{ color: 'var(--color-text-primary)', mb: 1, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <BlurText text="Contact" delay={100} animateBy="chars" direction="bottom" threshold={0.2} />
        </Typography>
        <Divider sx={{ mb: 6, borderColor: 'var(--color-border-glow)', maxWidth: 80, mx: 'auto' }} />

        {/* ── SNS / QR / 이메일 카드 3개 ── */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6, flexWrap: 'wrap', alignItems: 'stretch', gap: 2 }}>

          {/* SNS 카드 */}
          <Card sx={{
            flex: 1, minWidth: 180, maxWidth: 280,
            background: '#111111',
            border: '1px solid var(--color-border-default)',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(34,197,94,0.1)',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=420&h=200&fit=crop&q=80"
              alt="profile"
              sx={{ width: '100%', height: 130, objectFit: 'cover', flexShrink: 0 }}
            />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: '16px !important' }}>
              <Typography variant="overline" sx={{ color: 'var(--color-primary-dark)', letterSpacing: 3, display: 'block', mb: 1.5, textAlign: 'center' }}>
                SNS
              </Typography>
              <Button
                variant="outlined"
                startIcon={<InstagramIcon sx={{ fontSize: 16 }} />}
                href="https://www.instagram.com/csfdr99"
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
                size="small"
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary-dark)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  '&:hover': { borderColor: 'var(--color-primary-dark)', background: 'var(--color-secondary-light)' },
                }}
              >
                @csfdr99
              </Button>
            </CardContent>
          </Card>

          {/* QR 카드 */}
          <Card sx={{
            flex: 1, minWidth: 180, maxWidth: 280,
            background: '#111111',
            border: '1px solid var(--color-border-default)',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(34,197,94,0.1)',
            display: 'flex', flexDirection: 'column',
          }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: '16px !important' }}>
              <Typography variant="overline" sx={{ color: 'var(--color-primary-dark)', letterSpacing: 3, display: 'block', mb: 2, textAlign: 'center' }}>
                QR CODE
              </Typography>
              <Box sx={{ background: 'white', p: 1, borderRadius: 2, display: 'inline-block' }}>
                <QRCodeSVG value={PORTFOLIO_URL} size={130} fgColor="#1B4332" />
              </Box>
              <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', display: 'block', mt: 1.5, textAlign: 'center' }}>
                포트폴리오 바로가기
              </Typography>
            </CardContent>
          </Card>

          {/* 이메일 카드 */}
          <Card sx={{
            flex: 1, minWidth: 180, maxWidth: 280,
            background: '#111111',
            border: '1px solid var(--color-border-default)',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(34,197,94,0.1)',
            display: 'flex', flexDirection: 'column',
          }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: '16px !important' }}>
              <Typography variant="overline" sx={{ color: 'var(--color-primary-dark)', letterSpacing: 3, display: 'block', mb: 2, textAlign: 'center', alignSelf: 'stretch' }}>
                EMAIL
              </Typography>
              <Box sx={{
                width: 100, height: 100,
                bgcolor: '#03C75A',
                borderRadius: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mb: 2, flexShrink: 0,
              }}>
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 56, lineHeight: 1, fontFamily: 'sans-serif' }}>
                  N
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 14, color: 'var(--color-text-primary)', fontWeight: 700, wordBreak: 'break-all', textAlign: 'center', lineHeight: 1.6, mt: 'auto' }}>
                whdgy3019@naver.com
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', mt: 0.5 }}>
                네이버 메일
              </Typography>
            </CardContent>
          </Card>

        </Box>

        {/* ── 방명록 폼 ── */}
        <Typography
          variant="overline"
          sx={{ color: 'var(--color-primary-dark)', letterSpacing: 3, display: 'block', mb: 2 }}
        >
          GUESTBOOK
        </Typography>
        <Card
          sx={{
            background: '#111111',
            border: '1px solid var(--color-border-default)',
            borderRadius: 3,
            boxShadow: '0 2px 16px rgba(34,197,94,0.1)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ color: 'var(--color-text-primary)', mb: 3, fontWeight: 600 }}>
              방명록 남기기 ✍️
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <TextField required fullWidth label="이름 *"
                value={form.name} onChange={set('name')} sx={greenField} />

              <TextField fullWidth label="이메일"
                value={form.email} onChange={set('email')} sx={greenField} />

              <FormControl fullWidth sx={{ ...greenField, gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <InputLabel>어떻게 알게 되었나요?</InputLabel>
                <Select value={form.how_found} label="어떻게 알게 되었나요?" onChange={set('how_found')}
                  MenuProps={{ PaperProps: { sx: { background: '#111111' } } }}
                >
                  {['지인 소개', 'SNS', '검색엔진', '직접 방문', '기타'].map((h) => (
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 별점 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 1, gridColumn: '1 / -1' }}>
                <Typography sx={{ color: 'var(--color-text-muted)', mr: 1, fontSize: '0.9rem' }}>
                  별점
                </Typography>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Box
                    key={star}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setForm((p) => ({ ...p, rating: star }))}
                    sx={{
                      cursor: 'pointer',
                      fontSize: '2rem',
                      lineHeight: 1,
                      color: star <= (hover || form.rating) ? '#F4A623' : '#3A3A3A',
                      transition: 'color 0.15s',
                      userSelect: 'none',
                    }}
                  >
                    ★
                  </Box>
                ))}
                {form.rating > 0 && (
                  <Typography sx={{ color: 'var(--color-primary-dark)', ml: 1, fontSize: '0.85rem' }}>
                    {form.rating}점
                  </Typography>
                )}
              </Box>

              <TextField required fullWidth multiline rows={4} label="메시지 *"
                value={form.message} onChange={set('message')}
                sx={{ ...greenField, gridColumn: '1 / -1' }} />

              {error   && <Alert severity="error"   sx={{ gridColumn: '1 / -1' }}>{error}</Alert>}
              {success && (
                <Alert severity="success" sx={{ gridColumn: '1 / -1' }}>
                  방명록이 등록되었습니다! 감사합니다 🎉
                </Alert>
              )}

              <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    background: 'var(--color-button-primary)',
                    color: 'white',
                    '&:hover': { background: 'var(--color-button-hover)' },
                    px: 5, py: 1.5, borderRadius: 2,
                    minWidth: 180,
                  }}
                >
                  {loading
                    ? <CircularProgress size={24} color="inherit" />
                    : '방명록 남기기 ✍️'
                  }
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default ContactSection

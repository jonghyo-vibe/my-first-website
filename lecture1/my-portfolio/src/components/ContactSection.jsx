import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, Avatar, Button,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Divider, Alert, CircularProgress,
} from '@mui/material'
import EmailIcon       from '@mui/icons-material/Email'
import PhoneIcon       from '@mui/icons-material/Phone'
import LocationOnIcon  from '@mui/icons-material/LocationOn'
import InstagramIcon   from '@mui/icons-material/Instagram'
import PersonIcon      from '@mui/icons-material/Person'
import { QRCodeSVG }   from 'qrcode.react'
import { supabase }    from '../lib/supabase'

const PORTFOLIO_URL = 'https://jonghyo-vibe.github.io/my-first-website/my-portfolio/'

const darkField = {
  '& label': { color: 'rgba(255,255,255,0.55)' },
  '& label.Mui-focused': { color: 'var(--color-accent)' },
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset':             { borderColor: 'rgba(169,255,212,0.25)' },
    '&:hover fieldset':       { borderColor: 'rgba(169,255,212,0.55)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-accent)' },
  },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
}

const INIT_FORM = {
  name: '', message: '', email: '', phone: '',
  sns: '', organization: '', region: '', age_group: '',
  how_found: '', keyword: '', rating: 0,
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
    <Box
      sx={{
        background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, #0D2040 100%)',
        color: 'var(--color-text-secondary)',
      }}
    >
      <Box
        sx={{
          width: '100%', maxWidth: 1100, mx: 'auto',
          px: { xs: 3, md: 6 }, py: { xs: 8, md: 12 },
        }}
      >
        {/* ── 섹션 헤더 ── */}
        <Typography
          variant="overline"
          sx={{ color: 'var(--color-accent)', letterSpacing: 4, display: 'block', mb: 1, textAlign: 'center' }}
        >
          CONTACT
        </Typography>
        <Typography variant="h2" sx={{ color: 'white', mb: 1, textAlign: 'center' }}>
          Contact
        </Typography>
        <Divider sx={{ mb: 6, borderColor: 'var(--color-border-glow)', maxWidth: 80, mx: 'auto' }} />

        {/* ── 1. 프로필 카드 ── */}
        <Card
          sx={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(169,255,212,0.2)',
            borderRadius: 3, mb: 4,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, alignItems: 'center', flexWrap: 'wrap' }}>
              <Avatar
                sx={{
                  width: { xs: 72, md: 100 }, height: { xs: 72, md: 100 },
                  bgcolor: 'var(--color-primary)',
                  border: '3px solid var(--color-accent)',
                }}
              >
                <PersonIcon sx={{ fontSize: { xs: '2rem', md: '3rem' } }} />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 220 }}>
                <Typography
                  variant="h4"
                  sx={{ color: 'var(--color-accent)', fontWeight: 700, mb: 2, fontSize: { xs: '1.4rem', md: '2rem' } }}
                >
                  jonghyo-vibe
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: 'var(--color-primary-light)', fontSize: '1.2rem', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                      부산광역시 동래구 안락로 101번길 35, 101동 109호
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ color: 'var(--color-primary-light)', fontSize: '1.2rem', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                      whdgy3019@naver.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ color: 'var(--color-primary-light)', fontSize: '1.2rem', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                      010-0000-0000
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* ── 2. SNS 사각형 버튼 + QR 코드 ── */}
        <Box
          sx={{
            display: 'flex', gap: 3, mb: 6,
            flexWrap: 'wrap', alignItems: 'flex-start',
          }}
        >
          {/* SNS */}
          <Box>
            <Typography
              variant="overline"
              sx={{ color: 'var(--color-accent)', letterSpacing: 3, display: 'block', mb: 2 }}
            >
              SNS
            </Typography>
            <Button
              variant="outlined"
              startIcon={<InstagramIcon />}
              href="https://www.instagram.com/csfdr99"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: 'rgba(169,255,212,0.4)',
                color: 'white',
                borderRadius: 2,
                px: 3, py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  borderColor: 'var(--color-accent)',
                  background: 'rgba(169,255,212,0.1)',
                },
              }}
            >
              Instagram @csfdr99
            </Button>
          </Box>

          {/* QR 코드 */}
          <Box>
            <Typography
              variant="overline"
              sx={{ color: 'var(--color-accent)', letterSpacing: 3, display: 'block', mb: 2 }}
            >
              QR CODE
            </Typography>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(169,255,212,0.2)',
                borderRadius: 3,
                display: 'inline-block',
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: '16px !important' }}>
                <Box
                  sx={{
                    background: 'white', p: 1.5, borderRadius: 2,
                    display: 'inline-block',
                  }}
                >
                  <QRCodeSVG value={PORTFOLIO_URL} size={140} />
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 1.5 }}
                >
                  포트폴리오 바로가기
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* ── 3. 방명록 폼 ── */}
        <Typography
          variant="overline"
          sx={{ color: 'var(--color-accent)', letterSpacing: 3, display: 'block', mb: 2 }}
        >
          GUESTBOOK
        </Typography>
        <Card
          sx={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(169,255,212,0.2)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
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
              {/* 이름 */}
              <TextField
                required fullWidth label="이름 *"
                value={form.name} onChange={set('name')}
                sx={darkField}
              />
              {/* 이메일 */}
              <TextField
                fullWidth label="이메일"
                value={form.email} onChange={set('email')}
                sx={darkField}
              />
              {/* 전화번호 */}
              <TextField
                fullWidth label="전화번호"
                value={form.phone} onChange={set('phone')}
                sx={darkField}
              />
              {/* SNS */}
              <TextField
                fullWidth label="SNS 계정 (예: @username)"
                value={form.sns} onChange={set('sns')}
                sx={darkField}
              />
              {/* 소속/직업 */}
              <TextField
                fullWidth label="소속 / 직업"
                value={form.organization} onChange={set('organization')}
                sx={darkField}
              />
              {/* 나이대 */}
              <FormControl fullWidth sx={darkField}>
                <InputLabel>나이대</InputLabel>
                <Select value={form.age_group} label="나이대" onChange={set('age_group')}
                  MenuProps={{ PaperProps: { sx: { background: '#0D2040', color: 'white' } } }}
                >
                  {['10대', '20대', '30대', '40대', '50대 이상'].map((a) => (
                    <MenuItem key={a} value={a}>{a}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* 거주 지역 */}
              <TextField
                fullWidth label="거주 지역 (시 / 도)"
                value={form.region} onChange={set('region')}
                sx={darkField}
              />
              {/* 어떻게 알게 되었는지 */}
              <FormControl fullWidth sx={darkField}>
                <InputLabel>어떻게 알게 되었나요?</InputLabel>
                <Select value={form.how_found} label="어떻게 알게 되었나요?" onChange={set('how_found')}
                  MenuProps={{ PaperProps: { sx: { background: '#0D2040', color: 'white' } } }}
                >
                  {['지인 소개', 'SNS', '검색엔진', '직접 방문', '기타'].map((h) => (
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* 한마디 키워드 */}
              <TextField
                fullWidth label="한마디 키워드 (예: 천재, 멋있다)"
                value={form.keyword} onChange={set('keyword')}
                sx={darkField}
              />
              {/* 별점 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 1 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', mr: 1, fontSize: '0.9rem' }}>
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
                      color: star <= (hover || form.rating) ? '#FFD700' : 'rgba(255,255,255,0.25)',
                      transition: 'color 0.15s',
                      userSelect: 'none',
                    }}
                  >
                    ★
                  </Box>
                ))}
                {form.rating > 0 && (
                  <Typography sx={{ color: 'var(--color-accent)', ml: 1, fontSize: '0.85rem' }}>
                    {form.rating}점
                  </Typography>
                )}
              </Box>

              {/* 메시지 (full-width) */}
              <TextField
                required fullWidth multiline rows={4}
                label="메시지 *"
                value={form.message} onChange={set('message')}
                sx={{ ...darkField, gridColumn: '1 / -1' }}
              />

              {/* 알림 */}
              {error   && <Alert severity="error"   sx={{ gridColumn: '1 / -1' }}>{error}</Alert>}
              {success && (
                <Alert severity="success" sx={{ gridColumn: '1 / -1' }}>
                  방명록이 등록되었습니다! 감사합니다 🎉
                </Alert>
              )}

              {/* 제출 버튼 */}
              <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    background: 'var(--color-button-primary)',
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

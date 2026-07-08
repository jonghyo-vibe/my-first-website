import { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react'
import {
  Box, Typography, Chip, Avatar, Card, CardContent,
  Divider, Tooltip, Button, TextField,
} from '@mui/material'
import CircularSkillProgress from '../components/CircularSkillProgress'
import SchoolIcon    from '@mui/icons-material/School'
import WorkIcon      from '@mui/icons-material/Work'
import PaletteIcon   from '@mui/icons-material/Palette'
import HomeIcon      from '@mui/icons-material/Home'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import SortIcon      from '@mui/icons-material/Sort'
import AddIcon       from '@mui/icons-material/Add'
import { usePortfolio, CAT_COLORS } from '../context/PortfolioContext'

const CATEGORIES  = ['All', 'Frontend', 'Framework', 'Backend', 'Design', 'Tools']
const DEFAULT_SHOW = 6

const INFO_ITEMS = [
  { Icon: SchoolIcon,  key: 'education',  label: '학력' },
  { Icon: PaletteIcon, key: 'major',      label: '전공' },
  { Icon: WorkIcon,    key: 'experience', label: '경력' },
]

/* ── 스킬 카드 ── */
const SkillCard = memo(function SkillCard({ skill, visible, index }) {
  const color  = CAT_COLORS[skill.category] ?? '#22C55E'
  const numRef = useRef(null)
  const barRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!visible) return
    const delay    = (0.1 + index * 0.05) * 1000
    const duration = 900 + index * 60
    let startTime  = null

    const tid = setTimeout(() => {
      const animate = (now) => {
        if (startTime === null) startTime = now
        const p     = Math.min((now - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)

        if (numRef.current) numRef.current.textContent = `${Math.round(skill.level * eased)}%`
        if (barRef.current) barRef.current.style.width = `${skill.level * eased}%`

        if (p < 1) rafRef.current = requestAnimationFrame(animate)
      }
      rafRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(tid)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [visible, skill.level, index])

  return (
    <Tooltip title={skill.tooltip} placement="top" arrow>
      <Box sx={{
        position: 'relative', overflow: 'hidden',
        bgcolor: 'var(--c-bg)', border: '1px solid var(--c-border)',
        borderRadius: 2, p: 2, cursor: 'default',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': { borderColor: color, boxShadow: `0 0 16px ${color}22` },
      }}>
        {/* 스켈레톤 오버레이 */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          opacity: visible ? 0 : 1,
          transition: `opacity 0.4s ease ${index * 0.05}s`,
          '@keyframes shimmer': {
            '0%':   { backgroundPosition: '200% 0' },
            '100%': { backgroundPosition: '-200% 0' },
          },
          background: 'linear-gradient(90deg, #111 25%, #1e1e1e 50%, #111 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }} />

        {/* 실제 콘텐츠 */}
        <Box sx={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 0.45s ease ${index * 0.05}s, transform 0.45s ease ${index * 0.05}s`,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{
              width: 34, height: 34, borderRadius: 1.5,
              bgcolor: `${color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <skill.Icon sx={{ fontSize: 17, color }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'var(--c-text)', lineHeight: 1.2 }}>
                {skill.name}
              </Typography>
              <Typography sx={{ fontSize: 9, color, letterSpacing: 1, textTransform: 'uppercase' }}>
                {skill.category}
              </Typography>
            </Box>
            <Typography ref={numRef} sx={{ fontSize: 13, fontWeight: 800, color, flexShrink: 0 }}>
              0%
            </Typography>
          </Box>

          {/* rAF 커스텀 프로그래스 바 */}
          <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'var(--c-border)', overflow: 'hidden' }}>
            <Box
              ref={barRef}
              sx={{
                height: '100%', borderRadius: 2, width: 0,
                background: `linear-gradient(90deg, ${color}55, ${color})`,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Tooltip>
  )
})

/* ── 스킬 섹션 ── */
const SkillsSection = memo(function SkillsSection({ skills }) {
  const [cat, setCat]             = useState('All')
  const [sortLevel, setSortLevel] = useState(false)
  const [showCount, setShowCount] = useState(DEFAULT_SHOW)
  const [visible, setVisible]     = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const topFour = useMemo(
    () => [...skills].sort((a, b) => b.level - a.level).slice(0, 4),
    [skills]
  )

  let filtered = skills.filter(s => cat === 'All' || s.category === cat)
  if (sortLevel) filtered = [...filtered].sort((a, b) => b.level - a.level)
  const displayed = filtered.slice(0, showCount)
  const remaining = filtered.length - showCount

  const handleCatChange = (c) => { setCat(c); setShowCount(DEFAULT_SHOW) }

  return (
    <Card
      ref={ref}
      sx={{
        bgcolor: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 3, mt: 3,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
          <Box>
            <Typography sx={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'var(--c-muted)', textTransform: 'uppercase', mb: 0.3 }}>
              SKILLS
            </Typography>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--c-text)', lineHeight: 1 }}>
              기술 스택
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={<SortIcon sx={{ fontSize: 15 }} />}
            onClick={() => setSortLevel(p => !p)}
            sx={{
              fontSize: 11, fontWeight: 600, px: 1.5,
              borderColor: '#22C55E',
              color: sortLevel ? '#000' : '#22C55E',
              bgcolor: sortLevel ? '#22C55E' : 'transparent',
              border: '1px solid #22C55E', borderRadius: 1.5,
              '&:hover': { bgcolor: sortLevel ? '#16A34A' : 'rgba(34,197,94,0.08)' },
            }}
          >
            숙련도순
          </Button>
        </Box>

        {/* 원형 프로그래스 — Top 4 스킬 */}
        <Box sx={{
          display: 'flex', justifyContent: 'center',
          gap: { xs: 3, sm: 5 },
          py: 2.5, mb: 2.5,
          borderBottom: '1px solid var(--c-border)',
        }}>
          {topFour.map((skill, i) => (
            <CircularSkillProgress
              key={skill.id}
              skill={skill}
              color={CAT_COLORS[skill.category] ?? '#22C55E'}
              visible={visible}
              index={i}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2.5 }}>
          {CATEGORIES.map(c => {
            const active = cat === c
            const color  = CAT_COLORS[c] ?? '#22C55E'
            return (
              <Chip
                key={c} label={c} size="small"
                onClick={() => handleCatChange(c)}
                sx={{
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  bgcolor: active ? (c === 'All' ? '#22C55E' : color) : 'transparent',
                  color:   active ? '#000' : (c === 'All' ? 'var(--c-sub)' : color),
                  border:  `1px solid ${c === 'All' ? '#22C55E' : color}`,
                  opacity: active ? 1 : 0.55,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 1 },
                }}
              />
            )
          })}
        </Box>

        <Divider sx={{ borderColor: 'var(--c-border)', mb: 2.5 }} />

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 1.5,
        }}>
          {displayed.map((skill, i) => (
            <SkillCard key={skill.id} skill={skill} visible={visible} index={i} />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5, gap: 1 }}>
          {remaining > 0 && (
            <Button
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              onClick={() => setShowCount(p => p + DEFAULT_SHOW)}
              sx={{
                fontSize: 11, fontWeight: 600,
                border: '1px solid var(--c-border)', color: 'var(--c-muted)', borderRadius: 1.5,
                '&:hover': { borderColor: '#22C55E', color: '#22C55E', bgcolor: 'transparent' },
              }}
            >
              스킬 추가 ({remaining}개 더)
            </Button>
          )}
          {showCount > DEFAULT_SHOW && (
            <Button
              size="small"
              onClick={() => setShowCount(DEFAULT_SHOW)}
              sx={{
                fontSize: 11, fontWeight: 600,
                border: '1px solid var(--c-border)', color: 'var(--c-sub)', borderRadius: 1.5,
                '&:hover': { borderColor: 'var(--c-border)', color: 'var(--c-sub)', bgcolor: 'transparent' },
              }}
            >
              접기 ▲
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
})

/* ══════════════════════════════════════
   메인 컴포넌트
══════════════════════════════════════ */
export default function AboutMe() {
  const { aboutMeData, setAboutMeData } = usePortfolio()
  const fileInputRef  = useRef(null)
  const [toast, setToast] = useState(false)

  // 스크롤 트리거 애니메이션 상태
  const [profileVisible,  setProfileVisible]  = useState(false)
  const [sectionsVisible, setSectionsVisible] = useState(false)
  const profileRef  = useRef(null)
  const sectionsRef = useRef(null)

  useEffect(() => {
    const targets = [
      [profileRef.current,  setProfileVisible,  0.2],
      [sectionsRef.current, setSectionsVisible, 0.1],
    ]
    const observers = targets.map(([el, setter, threshold]) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setter(true); obs.disconnect() } },
        { threshold }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(obs => obs?.disconnect())
  }, [])

  const { basicInfo, sections, skills } = aboutMeData

  const updateSection = useCallback((id, newContent) => {
    setAboutMeData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === id ? { ...s, content: newContent } : s
      ),
    }))
    // showInHome 섹션 편집 시 토스트 표시
    setToast(true)
  }, [setAboutMeData])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(false), 2000)
    return () => clearTimeout(t)
  }, [toast])

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAboutMeData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, photo: url },
    }))
  }, [setAboutMeData])

  return (
    <>
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      bgcolor: 'var(--c-bg)',
      px: { xs: 2, sm: 4, md: 6 },
      py: { xs: 4, md: 6 },
    }}>
      <Box sx={{ maxWidth: 960, mx: 'auto' }}>

        {/* PORTFOLIO 2025 배지 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Box sx={{ border: '1px solid #22C55E', borderRadius: 1, px: 1.5, py: 0.4 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#22C55E', letterSpacing: 2 }}>
              PORTFOLIO 2025
            </Typography>
          </Box>
        </Box>

        {/* ── 기본 정보 카드 ── */}
        <Card
          ref={profileRef}
          sx={{
            bgcolor: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 3, mb: 3,
            opacity: profileVisible ? 1 : 0,
            transform: profileVisible ? 'translate3d(0,0,0)' : 'translate3d(-32px,0,0)',
            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
            willChange: 'transform',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' },
              gap: { xs: 3, sm: 4 }, alignItems: 'center',
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ position: 'relative', cursor: 'pointer', '&:hover .photo-overlay': { opacity: 1 } }}
                >
                  <Avatar
                    src={basicInfo.photo}
                    sx={{
                      width: 120, height: 120, bgcolor: 'var(--c-border)',
                      border: '2px solid var(--c-border)',
                      fontSize: '2.5rem', fontWeight: 700, color: '#22C55E',
                    }}
                  >
                    {!basicInfo.photo && basicInfo.name[0]}
                  </Avatar>
                  <Box className="photo-overlay" sx={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    bgcolor: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.2s',
                  }}>
                    <AddAPhotoIcon sx={{ color: '#22C55E', fontSize: 28 }} />
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 10, color: 'var(--c-muted)', letterSpacing: 1 }}>
                  클릭하여 사진 변경
                </Typography>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />
              </Box>

              <Box>
                <Typography sx={{
                  fontSize: { xs: '2rem', md: '2.8rem' },
                  fontWeight: 900, color: 'var(--c-text)', letterSpacing: -1, lineHeight: 1, mb: 0.5,
                }}>
                  {basicInfo.name}
                </Typography>
                <Box sx={{ width: 40, height: 3, bgcolor: '#22C55E', borderRadius: 2, mb: 2 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {INFO_ITEMS.map(({ Icon, key, label }) => (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Box sx={{
                        width: 28, height: 28, borderRadius: '50%',
                        bgcolor: 'rgba(34,197,94,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon sx={{ fontSize: 14, color: '#22C55E' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 9, color: 'var(--c-muted)', letterSpacing: 1, textTransform: 'uppercase', lineHeight: 1 }}>
                          {label}
                        </Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'var(--c-sub)', lineHeight: 1.3 }}>
                          {basicInfo[key]}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* ── 콘텐츠 섹션 카드들 (편집 가능) ── */}
        <Box ref={sectionsRef} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 0 }}>
          {sections.map((section, i) => (
            <Card key={section.id} sx={{
              bgcolor: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 3,
              opacity: sectionsVisible ? 1 : 0,
              transform: sectionsVisible ? 'translate3d(0,0,0)' : 'translate3d(0,28px,0)',
              transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.15}s, border-color 0.2s`,
              willChange: 'transform',
              '&:hover': { borderColor: '#22C55E33' },
            }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, fontWeight: 700, color: 'var(--c-text)' }}>
                    {section.title}
                  </Typography>
                  {section.showInHome && (
                    <Chip
                      icon={<HomeIcon sx={{ fontSize: '12px !important', color: '#22C55E !important' }} />}
                      label="홈 표시" size="small"
                      sx={{
                        fontSize: 10, height: 22,
                        bgcolor: 'rgba(34,197,94,0.1)', color: '#22C55E',
                        border: '1px solid rgba(34,197,94,0.3)',
                        '& .MuiChip-label': { px: 0.8 },
                      }}
                    />
                  )}
                </Box>
                <Divider sx={{ borderColor: 'var(--c-border)', mb: 2 }} />
                <TextField
                  multiline
                  minRows={2}
                  fullWidth
                  value={section.content}
                  onChange={(e) => updateSection(section.id, e.target.value)}
                  placeholder="내용을 입력하세요..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'var(--c-text)', fontSize: 14, lineHeight: 1.9,
                      '& fieldset': { borderColor: 'var(--c-border)' },
                      '&:hover fieldset': { borderColor: 'var(--c-border)' },
                      '&.Mui-focused fieldset': { borderColor: '#22C55E' },
                    },
                    '& .MuiOutlinedInput-input': { py: 1 },
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* ── 스킬 섹션 ── */}
        <SkillsSection skills={skills} />

      </Box>
    </Box>

    {/* ── 홈 반영 토스트 ── */}
    <Box
      role="status"
      aria-live="polite"
      sx={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 1300,
        display: 'flex', alignItems: 'center', gap: 1,
        bgcolor: 'rgba(10,10,10,0.9)',
        border: '1px solid rgba(34,197,94,0.45)',
        borderRadius: 2, px: 2, py: 1,
        pointerEvents: 'none',
        opacity: toast ? 1 : 0,
        transform: toast ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#22C55E', flexShrink: 0 }} />
      <Typography sx={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>
        홈에 반영됨
      </Typography>
    </Box>
    </>
  )
}

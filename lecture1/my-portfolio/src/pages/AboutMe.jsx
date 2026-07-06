import { useState, useRef, useEffect, memo, useCallback } from 'react'
import {
  Box, Typography, Chip, Avatar, Card, CardContent,
  Divider, LinearProgress, Tooltip, Button, TextField,
} from '@mui/material'
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

/* ── 스킬 카드 (memo: skill/visible/index 바뀔 때만 리렌더) ── */
const SkillCard = memo(function SkillCard({ skill, visible, index }) {
  const color = CAT_COLORS[skill.category] ?? '#22C55E'
  return (
    <Tooltip title={skill.tooltip} placement="top" arrow>
      <Box sx={{
        bgcolor: '#0A0A0A', border: '1px solid #1E1E1E',
        borderRadius: 2, p: 2, cursor: 'default',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.45s ease ${index * 0.05}s, transform 0.45s ease ${index * 0.05}s, border-color 0.2s, box-shadow 0.2s`,
        '&:hover': { borderColor: color, boxShadow: `0 0 16px ${color}22` },
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
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              {skill.name}
            </Typography>
            <Typography sx={{ fontSize: 9, color, letterSpacing: 1, textTransform: 'uppercase' }}>
              {skill.category}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 800, color, flexShrink: 0 }}>
            {skill.level}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={visible ? skill.level : 0}
          sx={{
            height: 4, borderRadius: 2, bgcolor: '#1E1E1E',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
              background: `linear-gradient(90deg, ${color}77, ${color})`,
              transition: `transform ${0.7 + index * 0.07}s cubic-bezier(0.4,0,0.2,1) ${0.1 + index * 0.05}s`,
            },
          }}
        />
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

  let filtered = skills.filter(s => cat === 'All' || s.category === cat)
  if (sortLevel) filtered = [...filtered].sort((a, b) => b.level - a.level)
  const displayed = filtered.slice(0, showCount)
  const remaining = filtered.length - showCount

  const handleCatChange = (c) => { setCat(c); setShowCount(DEFAULT_SHOW) }

  return (
    <Card
      ref={ref}
      sx={{
        bgcolor: '#111111', border: '1px solid #1E1E1E', borderRadius: 3, mt: 3,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
          <Box>
            <Typography sx={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: '#666', textTransform: 'uppercase', mb: 0.3 }}>
              SKILLS
            </Typography>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
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
                  color:   active ? '#000' : (c === 'All' ? '#888' : color),
                  border:  `1px solid ${c === 'All' ? '#22C55E' : color}`,
                  opacity: active ? 1 : 0.55,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 1 },
                }}
              />
            )
          })}
        </Box>

        <Divider sx={{ borderColor: '#1E1E1E', mb: 2.5 }} />

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
                border: '1px solid #1E1E1E', color: '#666', borderRadius: 1.5,
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
                border: '1px solid #1E1E1E', color: '#444', borderRadius: 1.5,
                '&:hover': { borderColor: '#555', color: '#888', bgcolor: 'transparent' },
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
      bgcolor: '#0A0A0A',
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
        <Card sx={{ bgcolor: '#111111', border: '1px solid #1E1E1E', borderRadius: 3, mb: 3 }}>
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
                      width: 120, height: 120, bgcolor: '#1A1A1A',
                      border: '2px solid #1E1E1E',
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
                <Typography sx={{ fontSize: 10, color: '#666', letterSpacing: 1 }}>
                  클릭하여 사진 변경
                </Typography>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />
              </Box>

              <Box>
                <Typography sx={{
                  fontSize: { xs: '2rem', md: '2.8rem' },
                  fontWeight: 900, color: '#fff', letterSpacing: -1, lineHeight: 1, mb: 0.5,
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
                        <Typography sx={{ fontSize: 9, color: '#666', letterSpacing: 1, textTransform: 'uppercase', lineHeight: 1 }}>
                          {label}
                        </Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#ccc', lineHeight: 1.3 }}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 0 }}>
          {sections.map((section) => (
            <Card key={section.id} sx={{
              bgcolor: '#111111', border: '1px solid #1E1E1E', borderRadius: 3,
              transition: 'border-color 0.2s',
              '&:hover': { borderColor: '#22C55E33' },
            }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, fontWeight: 700, color: '#fff' }}>
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
                <Divider sx={{ borderColor: '#1E1E1E', mb: 2 }} />
                <TextField
                  multiline
                  minRows={2}
                  fullWidth
                  value={section.content}
                  onChange={(e) => updateSection(section.id, e.target.value)}
                  placeholder="내용을 입력하세요..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#CCCCCC', fontSize: 14, lineHeight: 1.9,
                      '& fieldset': { borderColor: '#1E1E1E' },
                      '&:hover fieldset': { borderColor: '#333' },
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

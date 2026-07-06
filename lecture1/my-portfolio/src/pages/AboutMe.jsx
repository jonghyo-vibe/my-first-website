import { Box, Typography, Chip, Stack, LinearProgress, Avatar } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'

const SectionTitle = ({ children }) => (
  <Typography sx={{
    fontSize: '0.85rem', fontWeight: 800,
    color: 'var(--color-primary-dark)',
    letterSpacing: 2, textTransform: 'uppercase',
    mb: 1.5, mt: 3,
    pb: 0.5,
    borderBottom: '2px solid var(--color-accent-sage)',
    display: 'inline-block',
  }}>
    {children}
  </Typography>
)

const CONTACT = [
  { Icon: EmailIcon,  label: 'rlawhdgy2521@gmail.com' },
  { Icon: GitHubIcon, label: 'github.com/jonghyo-vibe' },
]

const EDUCATION = [
  { year: '2020', inst: '고등학교 졸업' },
  { year: '2024', inst: '소프트웨어학과 재학 중' },
]

const EXPERTISE = ['React', 'TypeScript', 'Frontend Dev', 'UI Design', 'Supabase', 'Tailwind CSS', 'Git']

const TOOLS = ['VS Code', 'Figma', 'GitHub', 'Vite', 'Supabase', 'Notion']

const SKILLS = [
  { label: 'JavaScript', level: 88 },
  { label: 'React',       level: 82 },
  { label: 'TypeScript',  level: 72 },
  { label: 'Tailwind CSS',level: 78 },
  { label: 'Supabase',    level: 65 },
]

const EXPERIENCES = [
  {
    year: '2024',
    company: '뷰테리어',
    title: '인테리어 커뮤니티 앱',
    desc: 'React · TypeScript · Supabase · Tailwind CSS',
  },
  {
    year: '2025',
    company: '미니 SNS',
    title: '소셜 미디어 플랫폼',
    desc: 'React · Supabase · TypeScript · Tailwind',
  },
]

const AboutMe = () => (
  <Box sx={{
    minHeight: 'calc(100vh - 64px)',
    bgcolor: 'var(--color-bg-primary)',
    position: 'relative',
    overflow: 'hidden',
  }}>

    {/* 장식 원형들 */}
    <Box sx={{ position: 'absolute', top: -90, left: -90, width: 260, height: 260, borderRadius: '50%', bgcolor: 'var(--color-primary)', opacity: 0.15, zIndex: 0 }} />
    <Box sx={{ position: 'absolute', top: 50, left: 100, width: 55, height: 55, borderRadius: '50%', bgcolor: 'var(--color-primary-dark)', opacity: 0.3, zIndex: 0 }} />
    <Box sx={{ position: 'absolute', bottom: -70, right: -50, width: 220, height: 220, borderRadius: '50%', bgcolor: 'var(--color-secondary)', opacity: 0.22, zIndex: 0 }} />
    <Box sx={{ position: 'absolute', bottom: 80, right: 120, width: 44, height: 44, borderRadius: '50%', bgcolor: 'var(--color-primary)', opacity: 0.45, zIndex: 0 }} />

    <Box sx={{
      position: 'relative', zIndex: 1,
      maxWidth: 960, mx: 'auto',
      px: { xs: 2, sm: 4, md: 6 },
      py: { xs: 4, md: 6 },
    }}>
      {/* RESUME 태그 (우측 상단) */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Box sx={{
          border: '1px solid var(--color-primary)',
          borderRadius: 1, px: 1.5, py: 0.4,
        }}>
          <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: 2 }}>
            PORTFOLIO 2025
          </Typography>
        </Box>
      </Box>

      {/* 2단 레이아웃 */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '5fr 8fr' },
        gap: { xs: 4, md: 6 },
        alignItems: 'start',
      }}>

        {/* ── 왼쪽 컬럼 ── */}
        <Box>
          {/* 프로필 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative', width: 130, height: 130, mb: 2 }}>
              {/* 블롭 배경 */}
              <Box sx={{
                position: 'absolute', top: -12, left: -12,
                width: 145, height: 145,
                borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
                bgcolor: 'var(--color-primary)',
                opacity: 0.3,
              }} />
              <Avatar sx={{
                width: 120, height: 120,
                position: 'relative', zIndex: 1,
                bgcolor: 'var(--color-primary)',
                border: '3px solid var(--color-primary)',
                fontSize: '2.8rem', fontWeight: 700,
              }}>
                J
              </Avatar>
            </Box>
            <Typography sx={{ fontSize: 10, letterSpacing: 3, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Frontend Developer
            </Typography>
          </Box>

          {/* 연락처 */}
          <SectionTitle>Contact</SectionTitle>
          <Stack spacing={1.2}>
            {CONTACT.map(({ Icon, label }) => (
              <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{
                  width: 28, height: 28, borderRadius: '50%',
                  bgcolor: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon sx={{ fontSize: 14, color: '#fff' }} />
                </Box>
                <Typography sx={{ fontSize: 11, color: 'var(--color-text-secondary)', wordBreak: 'break-all', lineHeight: 1.4 }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* 학력 */}
          <SectionTitle>Education</SectionTitle>
          <Stack spacing={1.5}>
            {EDUCATION.map((e) => (
              <Box key={e.year} sx={{ display: 'flex', gap: 1.5 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', minWidth: 34, pt: 0.2 }}>
                  {e.year}
                </Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                  {e.inst}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* 전문분야 */}
          <SectionTitle>Expertise</SectionTitle>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
            {EXPERTISE.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary-dark)',
                  fontSize: 11, fontWeight: 500,
                  '&:hover': { bgcolor: 'var(--color-secondary-light)' },
                }}
              />
            ))}
          </Box>

          {/* 툴 */}
          <SectionTitle>Tools</SectionTitle>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
            {TOOLS.map((tool) => (
              <Chip
                key={tool}
                label={tool}
                size="small"
                sx={{
                  bgcolor: 'rgba(34,197,94,0.1)',
                  color: 'var(--color-primary-dark)',
                  border: '1px solid var(--color-border-default)',
                  fontSize: 11, fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* ── 오른쪽 컬럼 ── */}
        <Box>
          {/* 이름 */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{
              fontSize: { xs: '2rem', md: '2.8rem' },
              fontWeight: 900, lineHeight: 1.1,
              color: 'var(--color-text-primary)',
              letterSpacing: -1,
            }}>
              JONGHYO
            </Typography>
            <Typography sx={{
              fontSize: { xs: '2.2rem', md: '3.2rem' },
              fontWeight: 900, lineHeight: 1.05,
              color: 'var(--color-primary)',
              letterSpacing: -1, mb: 0.8,
            }}>
              VIBE
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'var(--color-text-muted)', letterSpacing: 3, textTransform: 'uppercase' }}>
              Frontend Developer
            </Typography>
          </Box>

          {/* 자기소개 */}
          <Box sx={{
            bgcolor: '#111111',
            borderRadius: 2, p: 2.5, mb: 1,
            borderLeft: '4px solid var(--color-primary)',
            boxShadow: '0 0 20px rgba(34,197,94,0.08)',
          }}>
            <Typography sx={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 2 }}>
              <Box component="span" sx={{ fontSize: 22, fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>H</Box>
              i! 저는 사용자 경험을 중요시하는 프론트엔드 개발자입니다.
              React와 TypeScript를 주로 사용하며, 아름답고 직관적인 UI를 만드는 것을 즐깁니다.
              인테리어·디자인에 관심이 많아 관련 서비스를 직접 개발하며 성장하고 있습니다.
            </Typography>
          </Box>

          {/* 경험 */}
          <SectionTitle>Experiences</SectionTitle>
          <Stack spacing={2}>
            {EXPERIENCES.map((exp) => (
              <Box key={exp.company} sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', minWidth: 34, pt: 0.3 }}>
                  {exp.year}
                </Typography>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {exp.company}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic', mb: 0.3 }}>
                    {exp.title}
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: 'var(--color-primary)', letterSpacing: 0.3 }}>
                    {exp.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          {/* 스킬 바 */}
          <SectionTitle>Skills</SectionTitle>
          <Stack spacing={1.5}>
            {SKILLS.map((skill) => (
              <Box key={skill.label}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    {skill.label}
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                    {skill.level}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={skill.level}
                  sx={{
                    height: 7, borderRadius: 4,
                    bgcolor: 'var(--color-secondary-light)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, var(--color-primary-light), var(--color-primary-dark))',
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  </Box>
)

export default AboutMe

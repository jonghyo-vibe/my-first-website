import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import LanguageIcon       from '@mui/icons-material/Language'
import PaletteIcon        from '@mui/icons-material/Palette'
import FlashOnIcon        from '@mui/icons-material/FlashOn'
import DataObjectIcon     from '@mui/icons-material/DataObject'
import HubIcon            from '@mui/icons-material/Hub'
import ChangeHistoryIcon  from '@mui/icons-material/ChangeHistory'
import LoopIcon           from '@mui/icons-material/Loop'
import SmartphoneIcon     from '@mui/icons-material/Smartphone'
import StorageIcon        from '@mui/icons-material/Storage'
import TerminalIcon       from '@mui/icons-material/Terminal'
import CodeIcon           from '@mui/icons-material/Code'
import AccountTreeIcon    from '@mui/icons-material/AccountTree'
import DesignServicesIcon from '@mui/icons-material/DesignServices'

export const PortfolioContext = createContext()

export const CAT_COLORS = {
  Frontend:  '#22C55E',
  Framework: '#38BDF8',
  Backend:   '#A78BFA',
  Design:    '#F472B6',
  Tools:     '#FBB724',
}

const INIT_SKILLS = [
  { id: 1,  Icon: LanguageIcon,       name: 'HTML',         level: 80, category: 'Frontend',  tooltip: '시맨틱 마크업, 웹 표준 준수' },
  { id: 2,  Icon: PaletteIcon,        name: 'CSS',          level: 75, category: 'Frontend',  tooltip: 'Flexbox, Grid, 트랜지션 애니메이션' },
  { id: 3,  Icon: FlashOnIcon,        name: 'JavaScript',   level: 70, category: 'Frontend',  tooltip: 'ES6+, 비동기 처리, DOM 조작' },
  { id: 4,  Icon: DataObjectIcon,     name: 'TypeScript',   level: 65, category: 'Frontend',  tooltip: '타입 시스템, 인터페이스 설계' },
  { id: 5,  Icon: HubIcon,            name: 'Vue.js',       level: 40, category: 'Frontend',  tooltip: '컴포넌트 기반 프레임워크' },
  { id: 6,  Icon: ChangeHistoryIcon,  name: 'Angular',      level: 30, category: 'Frontend',  tooltip: 'TypeScript 기반 SPA 프레임워크' },
  { id: 7,  Icon: LoopIcon,           name: 'React',        level: 60, category: 'Framework', tooltip: '컴포넌트 기반 UI 개발, Hooks' },
  { id: 8,  Icon: SmartphoneIcon,     name: 'React Native', level: 35, category: 'Framework', tooltip: '크로스 플랫폼 모바일 앱 개발' },
  { id: 9,  Icon: StorageIcon,        name: 'Supabase',     level: 55, category: 'Framework', tooltip: 'BaaS, 실시간 DB, Auth 연동' },
  { id: 10, Icon: TerminalIcon,       name: 'Node.js',      level: 45, category: 'Backend',   tooltip: 'REST API, 서버사이드 개발' },
  { id: 11, Icon: CodeIcon,           name: 'Python',       level: 40, category: 'Backend',   tooltip: '데이터 처리, 스크립팅' },
  { id: 12, Icon: CodeIcon,           name: 'Java',         level: 30, category: 'Backend',   tooltip: '객체지향 프로그래밍 기초' },
  { id: 13, Icon: StorageIcon,        name: 'MongoDB',      level: 38, category: 'Backend',   tooltip: 'NoSQL 도큐먼트 데이터베이스' },
  { id: 14, Icon: DesignServicesIcon, name: 'Figma',        level: 65, category: 'Design',    tooltip: 'UI/UX 디자인, 프로토타이핑' },
  { id: 15, Icon: AccountTreeIcon,    name: 'Git',          level: 70, category: 'Tools',     tooltip: '버전 관리, 브랜치 전략, 협업' },
]

const INIT_DATA = {
  basicInfo: {
    name: '김종효', education: '이리보고',
    major: '예체능', experience: '신입', photo: '',
  },
  sections: [
    { id: 'dev-story',  title: '나의 개발 스토리', showInHome: true,
      content: '이전부터 계속 하고 싶다고 생각을 하다가 지금보다 더 늦어지면 안될 것 같아서 열심히 준비하였음' },
    { id: 'philosophy', title: '개발 철학',         showInHome: true,
      content: '메세지가 편안하게 들어와야 한다' },
    { id: 'personal',   title: '개인적인 이야기',   showInHome: false,
      content: 'AI에 관심, OTT 시청을 좋아함' },
  ],
  skills: INIT_SKILLS,
}

export function PortfolioProvider({ children }) {
  const [aboutMeData, setAboutMeData] = useState(INIT_DATA)

  // aboutMeData가 바뀔 때만 재계산
  const homeData = useMemo(() => {
    const content = aboutMeData.sections
      .filter(s => s.showInHome)
      .map(s => ({
        title:   s.title,
        summary: s.content.length > 120
          ? s.content.substring(0, 120) + '...'
          : s.content,
      }))
    const topSkills = [...aboutMeData.skills]
      .sort((a, b) => b.level - a.level)
      .slice(0, 4)
    return { content, topSkills, basicInfo: aboutMeData.basicInfo }
  }, [aboutMeData])

  const getHomeData = useCallback(() => homeData, [homeData])

  return (
    <PortfolioContext.Provider value={{ aboutMeData, setAboutMeData, homeData, getHomeData }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => useContext(PortfolioContext)

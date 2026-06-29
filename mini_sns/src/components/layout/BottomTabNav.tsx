import { useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiGrid, FiPlusSquare, FiUser } from 'react-icons/fi'

const tabs = [
  { path: '/',       icon: FiHome,      label: '홈' },
  { path: '/posts',  icon: FiGrid,      label: '피드' },
  { path: '/posts/create', icon: FiPlusSquare, label: '올리기' },
  { path: '/mypage', icon: FiUser,      label: '마이' },
]

export default function BottomTabNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-slate-100 z-50 safe-area-pb">
      <div className="flex items-center justify-around h-[70px] px-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = isActive(path)
          const isCreate = path === '/posts/create'
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full touch-target transition-colors ${
                isCreate
                  ? 'text-white'
                  : active
                  ? 'text-sky-500'
                  : 'text-slate-400'
              }`}
            >
              {isCreate ? (
                <span className="flex items-center justify-center w-11 h-11 bg-sky-500 rounded-2xl shadow-md shadow-sky-200">
                  <Icon className="w-5 h-5 text-white" />
                </span>
              ) : (
                <>
                  <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : ''}`} />
                  <span className={`text-[10px] font-medium ${active ? 'text-sky-500' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

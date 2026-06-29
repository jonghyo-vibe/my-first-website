import { useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiBell, FiSearch } from 'react-icons/fi'
import { useAuth } from '../../store/authContext'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showActions?: boolean
}

export default function Header({ title, showBack = false, showActions = true }: HeaderProps) {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-sky-100 shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="touch-target flex items-center justify-center text-slate-600 mr-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title ? (
            <span className="font-semibold text-slate-800 text-base">{title}</span>
          ) : (
            <button onClick={() => navigate('/')} className="flex items-center gap-1">
              <span className="text-xl font-bold text-sky-500">뷰</span>
              <span className="text-xl font-bold text-slate-700">테리어</span>
            </button>
          )}
        </div>

        {showActions && (
          <div className="flex items-center gap-1">
            <button className="touch-target flex items-center justify-center text-slate-600 hover:text-sky-500 transition-colors">
              <FiSearch className="w-5 h-5" />
            </button>
            <button
              className="touch-target flex items-center justify-center text-slate-600 hover:text-sky-500 transition-colors"
              onClick={() => navigate('/mypage')}
            >
              <FiBell className="w-5 h-5" />
            </button>
            <button
              className="touch-target flex items-center justify-center text-slate-600 hover:text-sky-500 transition-colors relative"
              onClick={() => navigate('/mypage')}
            >
              <FiShoppingCart className="w-5 h-5" />
            </button>
            {!currentUser && (
              <button
                onClick={() => navigate('/login')}
                className="ml-1 px-3 py-1.5 bg-sky-500 text-white text-xs font-medium rounded-full hover:bg-sky-600 transition-colors"
              >
                로그인
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

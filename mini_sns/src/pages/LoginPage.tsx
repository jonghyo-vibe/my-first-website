import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi'
import { FaGoogle, FaApple } from 'react-icons/fa'
import { SiNaver, SiKakaotalk } from 'react-icons/si'
import { useAuth } from '../store/authContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = isLogin
      ? await login(email, password)
      : await register(email, password, displayName)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 일러스트 영역 */}
      <div className="bg-gradient-to-br from-sky-400 to-sky-600 h-48 flex flex-col items-center justify-center">
        <div className="text-center">
          <span className="text-4xl font-bold text-white">뷰</span>
          <span className="text-4xl font-bold text-sky-100">테리어</span>
        </div>
        <p className="text-sky-100 text-sm mt-2">내 공간에 꼭 맞는 인테리어 가구</p>
      </div>

      <div className="flex-1 px-6 pt-8">
        {/* 탭 전환 */}
        <div className="flex bg-slate-100 rounded-2xl p-1 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              isLogin ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              !isLogin ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="닉네임"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                required={!isLogin}
                className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          )}
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-11 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-rose-500 text-sm bg-rose-50 px-4 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-xs">또는 SNS로 계속하기</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* SNS 로그인 버튼 (둥근 원형, 가로 배치) */}
        <div className="flex items-center justify-center gap-4">
          <button className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <FaGoogle className="w-5 h-5 text-red-500" />
          </button>
          <button className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <SiKakaotalk className="w-5 h-5 text-[#3A1D1D]" />
          </button>
          <button className="w-12 h-12 rounded-full bg-[#03C75A] flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <SiNaver className="w-4 h-4 text-white" />
          </button>
          <button className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <FaApple className="w-5 h-5 text-white" />
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8 pb-8">
          가입 시 뷰테리어의 이용약관 및 개인정보 처리방침에 동의합니다.
        </p>
      </div>
    </div>
  )
}

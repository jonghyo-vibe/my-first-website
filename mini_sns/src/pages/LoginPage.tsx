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
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    if (isLogin) {
      const result = await login(email, password)
      setLoading(false)
      if (result.error) {
        setError(result.error)
      } else {
        navigate('/')
      }
    } else {
      if (password.length < 6) {
        setError('비밀번호는 6자 이상이어야 합니다.')
        setLoading(false)
        return
      }
      const result = await register(email, password, displayName)
      setLoading(false)
      if (result.error) {
        setError(result.error)
      } else if (result.needsConfirm) {
        setInfo(`${email}로 인증 메일을 발송했습니다.\n메일 확인 후 로그인해주세요.`)
        setIsLogin(true)
      } else {
        navigate('/')
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 h-48 flex flex-col items-center justify-center">
        <div className="text-center">
          <span className="text-4xl font-bold text-white">뷰</span>
          <span className="text-4xl font-bold text-indigo-100">테리어</span>
        </div>
        <p className="text-indigo-100 text-sm mt-2">내 공간에 꼭 맞는 인테리어 가구</p>
      </div>

      <div className="flex-1 px-6 pt-8">
        {/* 로그인 / 회원가입 탭 */}
        <div className="flex bg-violet-100 rounded-2xl p-1 mb-8">
          <button
            onClick={() => { setIsLogin(true); setError(''); setInfo('') }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); setInfo('') }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              !isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
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
                placeholder="닉네임 (2자 이상)"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                required={!isLogin}
                minLength={2}
                className="w-full pl-11 pr-4 py-3.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
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
              className="w-full pl-11 pr-4 py-3.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder={isLogin ? '비밀번호' : '비밀번호 (6자 이상)'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-11 py-3.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
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
            <p className="text-rose-500 text-sm bg-rose-50 px-4 py-3 rounded-xl">{error}</p>
          )}
          {info && (
            <p className="text-indigo-600 text-sm bg-indigo-50 px-4 py-3 rounded-xl whitespace-pre-line">{info}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 active:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        {/* SNS 로그인 */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-violet-200" />
          <span className="text-slate-400 text-xs">또는 SNS로 계속하기</span>
          <div className="flex-1 h-px bg-violet-200" />
        </div>
        <div className="flex items-center justify-center gap-4">
          <button className="w-12 h-12 rounded-full bg-white border border-violet-200 flex items-center justify-center shadow-sm">
            <FaGoogle className="w-5 h-5 text-red-500" />
          </button>
          <button className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center shadow-sm">
            <SiKakaotalk className="w-5 h-5 text-[#3A1D1D]" />
          </button>
          <button className="w-12 h-12 rounded-full bg-[#03C75A] flex items-center justify-center shadow-sm">
            <SiNaver className="w-4 h-4 text-white" />
          </button>
          <button className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-sm">
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

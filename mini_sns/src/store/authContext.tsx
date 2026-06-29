import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { SnsUser } from '../types'

interface AuthContextType {
  currentUser: SnsUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (email: string, password: string, displayName: string) => Promise<{ error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SnsUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('sns_user')
    if (stored) {
      try { setCurrentUser(JSON.parse(stored)) } catch { /* ignore */ }
    }
    setLoading(false)
  }, [])

  async function login(email: string, _password: string) {
    const { data, error } = await supabase
      .from('sns_users')
      .select('*')
      .eq('email', email)
      .single()
    if (error || !data) return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    // 데모용: password 필드 없으므로 이메일 존재 여부만 확인
    setCurrentUser(data)
    localStorage.setItem('sns_user', JSON.stringify(data))
    return {}
  }

  async function register(email: string, _password: string, displayName: string) {
    const existing = await supabase.from('sns_users').select('id').eq('email', email).single()
    if (existing.data) return { error: '이미 사용 중인 이메일입니다.' }
    const { data, error } = await supabase
      .from('sns_users')
      .insert({ email, display_name: displayName })
      .select()
      .single()
    if (error || !data) return { error: '회원가입 중 오류가 발생했습니다.' }
    setCurrentUser(data)
    localStorage.setItem('sns_user', JSON.stringify(data))
    return {}
  }

  function logout() {
    setCurrentUser(null)
    localStorage.removeItem('sns_user')
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

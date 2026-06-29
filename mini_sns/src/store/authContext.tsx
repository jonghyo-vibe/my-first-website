import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { SnsUser } from '../types'

interface AuthContextType {
  currentUser: SnsUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (email: string, password: string, displayName: string) => Promise<{ error?: string; needsConfirm?: boolean }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

async function fetchOrCreateProfile(userId: string, email: string, displayName?: string): Promise<SnsUser | null> {
  const { data: existing } = await supabase.from('sns_users').select('*').eq('id', userId).single()
  if (existing) return existing as SnsUser
  if (!displayName) return null
  const { data: created } = await supabase.from('sns_users')
    .insert({ id: userId, email, display_name: displayName })
    .select().single()
  return (created ?? null) as SnsUser | null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SnsUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = session.user
        const profile = await fetchOrCreateProfile(u.id, u.email ?? '', u.user_metadata?.display_name)
        setCurrentUser(profile)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const u = session.user
        const profile = await fetchOrCreateProfile(u.id, u.email ?? '', u.user_metadata?.display_name)
        setCurrentUser(profile)
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function login(email: string, password: string): Promise<{ error?: string }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) return {}
    if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: '이메일 인증이 필요합니다. 받은 편지함을 확인해주세요.' }
    }
    return { error: '로그인 중 오류가 발생했습니다.' }
  }

  async function register(email: string, password: string, displayName: string): Promise<{ error?: string; needsConfirm?: boolean }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    if (error) {
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        return { error: '이미 사용 중인 이메일입니다.' }
      }
      return { error: error.message }
    }
    // 이메일 확인 미완료 → 세션 없음
    if (!data.session) return { needsConfirm: true }
    // 즉시 로그인됨 → 프로필 생성
    if (data.user) {
      await fetchOrCreateProfile(data.user.id, email, displayName)
    }
    return {}
  }

  async function logout() {
    await supabase.auth.signOut()
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

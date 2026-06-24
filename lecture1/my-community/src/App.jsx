import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PostListPage from './pages/PostListPage'
import PostDetailPage from './pages/PostDetailPage'
import WritePostPage from './pages/WritePostPage'
import DesignersPage from './pages/DesignersPage'
import PricePage from './pages/PricePage'
import ReservationPage from './pages/ReservationPage'

const getGrade = (postCount) => {
  if (postCount >= 20) return { label: '미용마스터', emoji: '👑', color: '#f5a623' }
  if (postCount >= 10) return { label: '단골손님', emoji: '💜', color: '#9575cd' }
  if (postCount >= 5)  return { label: '미용러버', emoji: '⭐', color: '#7c5cc4' }
  if (postCount >= 1)  return { label: '집사', emoji: '🐾', color: '#b39ddb' }
  return { label: '새싹', emoji: '🌱', color: '#66bb6a' }
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleLogin = async (userData) => {
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userData.id)
    const grade = getGrade(count || 0)
    const enriched = { ...userData, grade }
    localStorage.setItem('user', JSON.stringify(enriched))
    setUser(enriched)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <BrowserRouter basename="/my-first-website">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<PostListPage user={user} />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onLogin={handleLogin} />} />
        <Route path="/posts/:id" element={<PostDetailPage user={user} />} />
        <Route path="/write" element={<WritePostPage user={user} />} />
        <Route path="/designers" element={<DesignersPage />} />
        <Route path="/price" element={<PricePage />} />
        <Route path="/reservation" element={<ReservationPage user={user} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

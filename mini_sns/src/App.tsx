import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './store/authContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import PostListPage from './pages/PostListPage'
import PostDetailPage from './pages/PostDetailPage'
import PostCreatePage from './pages/PostCreatePage'
import MyPage from './pages/MyPage'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/create" element={<PostCreatePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

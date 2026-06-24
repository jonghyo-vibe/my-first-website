import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', form.email)
      .single()

    if (error || !data) {
      setErrors({ email: '이메일 또는 비밀번호가 올바르지 않습니다.' })
      setLoading(false)
      return
    }

    if (data.password !== form.password) {
      setErrors({ password: '이메일 또는 비밀번호가 올바르지 않습니다.' })
      setLoading(false)
      return
    }

    localStorage.setItem('user', JSON.stringify(data))
    navigate('/')
  }

  return (
    <div style={styles.wrap}>
      <div className="card" style={styles.box}>
        <div style={styles.logo}>🐾 미용애옹</div>
        <p style={styles.sub}>반려동물 미용 커뮤니티</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <input
              name="email"
              type="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div style={styles.field}>
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div style={styles.links}>
          <span onClick={() => navigate('/register')} style={styles.link}>회원가입</span>
          <span style={styles.dot}>·</span>
          <span style={styles.link}>아이디/비밀번호 찾기</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  box: { width: '100%', maxWidth: 400, padding: '40px 32px' },
  logo: { fontSize: 28, fontWeight: 700, color: 'var(--primary)', textAlign: 'center', marginBottom: 4 },
  sub: { textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  field: { display: 'flex', flexDirection: 'column' },
  links: { marginTop: 20, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' },
  link: { fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' },
  link_hover: { textDecoration: 'underline' },
  dot: { color: 'var(--border)', fontSize: 12 },
}

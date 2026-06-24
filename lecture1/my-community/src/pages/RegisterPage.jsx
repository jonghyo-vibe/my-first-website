import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nickname: '', email: '', password: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from('users')
      .insert([{ nickname: form.nickname, email: form.email, password: form.password, phone: form.phone }])
      .select()
      .single()

    if (error) {
      if (error.message.includes('email')) {
        setErrors({ email: '이미 사용 중인 이메일입니다.' })
      } else if (error.message.includes('nickname')) {
        setErrors({ nickname: '이미 사용 중인 닉네임입니다.' })
      } else {
        setErrors({ email: '회원가입 중 오류가 발생했습니다.' })
      }
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
        <p style={styles.sub}>회원가입</p>

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.field}>
            <input name="nickname" placeholder="닉네임" value={form.nickname} onChange={handleChange} className={errors.nickname ? 'error' : ''} required />
            {errors.nickname && <p className="error-text">{errors.nickname}</p>}
          </div>
          <div style={styles.field}>
            <input name="email" type="email" placeholder="이메일" value={form.email} onChange={handleChange} className={errors.email ? 'error' : ''} required />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div style={styles.field}>
            <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <input name="phone" placeholder="전화번호 (선택)" value={form.phone} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div style={styles.links}>
          <span onClick={() => navigate('/login')} style={styles.link}>이미 계정이 있으신가요? 로그인</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  box: { width: '100%', maxWidth: 400, padding: '40px 32px' },
  logo: { fontSize: 28, fontWeight: 700, color: 'var(--primary)', textAlign: 'center', marginBottom: 4 },
  sub: { textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600, marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  field: { display: 'flex', flexDirection: 'column' },
  links: { marginTop: 20, textAlign: 'center' },
  link: { fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' },
}

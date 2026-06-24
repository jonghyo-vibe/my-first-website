import { useNavigate } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <span style={styles.logo} onClick={() => navigate('/')}>🐾 미용애옹</span>
        <div style={styles.right}>
          {user ? (
            <>
              <span style={styles.nick}>👤 {user.nickname}</span>
              <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => navigate('/write')}>글쓰기</button>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={onLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => navigate('/login')}>로그인</button>
              <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => navigate('/register')}>회원가입</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: { background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(155,127,232,0.08)' },
  inner: { maxWidth: 900, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 20, fontWeight: 700, color: 'var(--primary)', cursor: 'pointer' },
  right: { display: 'flex', alignItems: 'center', gap: 8 },
  nick: { fontSize: 13, color: 'var(--text-muted)' },
}

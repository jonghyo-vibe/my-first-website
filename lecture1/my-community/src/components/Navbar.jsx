import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/', label: '🏠 홈' },
  { path: '/designers', label: '✂️ 디자이너' },
  { path: '/price', label: '💰 가격표' },
  { path: '/reservation', label: '📅 예약' },
]

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <span style={s.logo} onClick={() => navigate('/')}>🐾 미용애옹</span>

        <div style={s.menu}>
          {NAV_ITEMS.map((item) => (
            <span
              key={item.path}
              style={{ ...s.menuItem, ...(location.pathname === item.path ? s.menuActive : {}) }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </span>
          ))}
        </div>

        <div style={s.right}>
          {user ? (
            <>
              <span style={s.nick}>👤 {user.nickname}</span>
              <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => navigate('/write')}>✏️ 글쓰기</button>
              <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={onLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => navigate('/login')}>로그인</button>
              <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => navigate('/register')}>회원가입</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

const s = {
  nav: { background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(179,157,219,0.1)' },
  inner: { maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 62, display: 'flex', alignItems: 'center', gap: 24 },
  logo: { fontSize: 20, fontWeight: 900, color: 'var(--primary-dark)', cursor: 'pointer', flexShrink: 0, letterSpacing: '-0.5px' },
  menu: { display: 'flex', gap: 4, flex: 1 },
  menuItem: { fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', padding: '6px 12px', borderRadius: 50, cursor: 'pointer', transition: 'all 0.15s' },
  menuActive: { color: 'var(--primary-dark)', background: 'var(--primary-soft)' },
  right: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  nick: { fontSize: 12, color: 'var(--text-muted)' },
}

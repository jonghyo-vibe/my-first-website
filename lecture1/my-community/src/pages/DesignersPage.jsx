import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function DesignersPage() {
  const navigate = useNavigate()
  const [designers, setDesigners] = useState([])

  useEffect(() => {
    supabase.from('designers').select('*').order('career_years', { ascending: false }).then(({ data }) => setDesigners(data || []))
  }, [])

  return (
    <div style={s.wrap}>
      <div style={s.hero}>
        <p style={{ fontSize: 40, marginBottom: 8 }}>✂️</p>
        <h1 style={s.heroTitle}>우리 디자이너</h1>
        <p style={s.heroSub}>미용애옹의 전문 디자이너를 소개합니다 💜</p>
      </div>

      <div style={s.container}>
        <div style={s.grid}>
          {designers.map((d) => (
            <div key={d.id} className="card" style={s.card}>
              <div style={s.photoWrap}>
                {d.photo_url
                  ? <img src={d.photo_url} alt={d.name} style={s.photo} />
                  : <div style={s.photoFallback}>✂️</div>
                }
              </div>
              <div style={s.body}>
                <div style={s.topRow}>
                  <h3 style={s.name}>{d.name} 디자이너</h3>
                  <span style={s.career}>경력 {d.career_years}년</span>
                </div>
                {d.specialty && (
                  <span className="tag" style={{ marginBottom: 10, display: 'inline-flex' }}>✨ {d.specialty}</span>
                )}
                <p style={s.bio}>{d.bio}</p>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => navigate('/reservation')}>
                  📅 이 디자이너에게 예약하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const s = {
  wrap: { minHeight: '100vh' },
  hero: { background: 'linear-gradient(145deg, #e1d5f7 0%, #c9b8f0 100%)', padding: '52px 20px 40px', textAlign: 'center' },
  heroTitle: { fontSize: 34, fontWeight: 900, color: '#fff', marginBottom: 8, textShadow: '0 2px 8px rgba(0,0,0,0.12)' },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 15 },
  container: { maxWidth: 900, margin: '0 auto', padding: '32px 20px 48px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 },
  card: { overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  photoWrap: { width: '100%', height: 220, overflow: 'hidden', background: 'var(--primary-light)' },
  photo: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' },
  photoFallback: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 },
  body: { padding: '20px 22px 22px', flex: 1 },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 900, color: 'var(--text)' },
  career: { fontSize: 12, color: 'var(--primary-dark)', fontWeight: 700, background: 'var(--primary-soft)', padding: '3px 10px', borderRadius: 50 },
  bio: { fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 },
}

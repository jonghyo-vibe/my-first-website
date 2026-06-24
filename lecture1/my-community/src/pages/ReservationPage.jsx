import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const TIMES = ['10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']
const SERVICES = ['기본 목욕', '스파 목욕', '기본 미용', '부분 미용', '스타일 컷', '귀 청소', '발톱 정리', '풀 패키지']

export default function ReservationPage({ user }) {
  const navigate = useNavigate()
  const [designers, setDesigners] = useState([])
  const [form, setForm] = useState({ designer_id: '', service_name: '', pet_name: '', pet_breed: '', reserved_date: '', reserved_time: '', note: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [myReservations, setMyReservations] = useState([])

  useEffect(() => {
    supabase.from('designers').select('id, name, specialty').then(({ data }) => setDesigners(data || []))
    if (user) {
      supabase.from('reservations').select('*, designers(name)').eq('user_id', user.id).order('reserved_date').then(({ data }) => setMyReservations(data || []))
    }
  }, [user])

  if (!user) return (
    <div style={s.center}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>🔒</p>
      <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>로그인이 필요해요</p>
      <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>예약하려면 먼저 로그인해 주세요.</p>
      <button className="btn btn-primary" onClick={() => navigate('/login')}>로그인하러 가기</button>
    </div>
  )

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('reservations').insert({
      user_id: user.id,
      designer_id: form.designer_id || null,
      service_name: form.service_name,
      pet_name: form.pet_name,
      pet_breed: form.pet_breed,
      reserved_date: form.reserved_date,
      reserved_time: form.reserved_time,
      note: form.note || null,
    })
    setLoading(false)
    if (!error) {
      setDone(true)
      const { data } = await supabase.from('reservations').select('*, designers(name)').eq('user_id', user.id).order('reserved_date')
      setMyReservations(data || [])
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('예약을 취소할까요?')) return
    await supabase.from('reservations').delete().eq('id', id)
    setMyReservations(myReservations.filter((r) => r.id !== id))
  }

  const today = new Date().toISOString().split('T')[0]
  const STATUS_LABEL = { pending: '⏳ 예약 대기', confirmed: '✅ 예약 확정', cancelled: '❌ 취소됨' }

  return (
    <div style={s.wrap}>
      <div style={s.hero}>
        <p style={{ fontSize: 40, marginBottom: 8 }}>📅</p>
        <h1 style={s.heroTitle}>예약하기</h1>
        <p style={s.heroSub}>날짜와 시간을 선택하고 예약해 보세요 🐾</p>
      </div>

      <div style={s.container}>
        <div style={s.layout}>
          {/* 예약 폼 */}
          <div>
            {done ? (
              <div className="card" style={s.doneBox}>
                <p style={{ fontSize: 48 }}>🎉</p>
                <h3 style={{ fontSize: 20, fontWeight: 900, margin: '12px 0 6px' }}>예약 완료!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>예약이 접수됐어요. 확정 후 연락드릴게요 💜</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-outline" onClick={() => setDone(false)}>추가 예약</button>
                  <button className="btn btn-primary" onClick={() => navigate('/')}>홈으로</button>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 28 }}>
                <h2 style={s.formTitle}>✏️ 예약 정보 입력</h2>
                <form onSubmit={handleSubmit} style={s.form}>
                  <div style={s.row}>
                    <div style={s.field}>
                      <label style={s.label}>디자이너 선택</label>
                      <select name="designer_id" value={form.designer_id} onChange={handleChange} style={s.select}>
                        <option value="">디자이너 선택 (선택사항)</option>
                        {designers.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
                      </select>
                    </div>
                    <div style={s.field}>
                      <label style={s.label}>서비스 선택 *</label>
                      <select name="service_name" value={form.service_name} onChange={handleChange} required style={s.select}>
                        <option value="">서비스를 선택해 주세요</option>
                        {SERVICES.map((sv) => <option key={sv} value={sv}>{sv}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={s.row}>
                    <div style={s.field}>
                      <label style={s.label}>반려견 이름 *</label>
                      <input name="pet_name" value={form.pet_name} onChange={handleChange} placeholder="예: 뭉치" required />
                    </div>
                    <div style={s.field}>
                      <label style={s.label}>견종</label>
                      <input name="pet_breed" value={form.pet_breed} onChange={handleChange} placeholder="예: 말티즈" />
                    </div>
                  </div>

                  <div style={s.row}>
                    <div style={s.field}>
                      <label style={s.label}>날짜 선택 *</label>
                      <input type="date" name="reserved_date" value={form.reserved_date} onChange={handleChange} min={today} required />
                    </div>
                    <div style={s.field}>
                      <label style={s.label}>시간 선택 *</label>
                      <div style={s.timeGrid}>
                        {TIMES.map((t) => (
                          <button key={t} type="button"
                            style={{ ...s.timeBtn, ...(form.reserved_time === t ? s.timeBtnActive : {}) }}
                            onClick={() => setForm({ ...form, reserved_time: t })}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>특이사항 / 요청사항</label>
                    <textarea name="note" value={form.note} onChange={handleChange} placeholder="알러지, 예민한 부위, 원하는 스타일 등을 적어주세요" rows={3} style={{ resize: 'vertical' }} />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8, padding: '14px' }} disabled={loading || !form.reserved_time}>
                    {loading ? '예약 중...' : '📅 예약 확정하기'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* 내 예약 목록 */}
          <div>
            <div className="card" style={{ padding: 24 }}>
              <h2 style={s.formTitle}>📋 내 예약 목록</h2>
              {myReservations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>예약 내역이 없어요</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {myReservations.map((r) => (
                    <div key={r.id} style={s.resCard}>
                      <div style={s.resTop}>
                        <span style={s.resService}>{r.service_name}</span>
                        <span style={{ fontSize: 12, color: r.status === 'confirmed' ? 'var(--success)' : 'var(--text-muted)' }}>{STATUS_LABEL[r.status] || r.status}</span>
                      </div>
                      <p style={s.resMeta}>🐶 {r.pet_name} {r.pet_breed && `(${r.pet_breed})`}</p>
                      <p style={s.resMeta}>📅 {r.reserved_date} {r.reserved_time}</p>
                      {r.designers && <p style={s.resMeta}>✂️ {r.designers.name} 디자이너</p>}
                      {r.status === 'pending' && (
                        <button className="btn btn-ghost" style={{ fontSize: 11, color: 'var(--error)', marginTop: 6 }} onClick={() => handleCancel(r.id)}>예약 취소</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
  container: { maxWidth: 960, margin: '0 auto', padding: '32px 20px 48px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' },
  formTitle: { fontSize: 17, fontWeight: 900, marginBottom: 20, color: 'var(--text)' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 700, color: 'var(--text)' },
  select: { border: '1.5px solid var(--border)', borderRadius: 12, padding: '11px 14px', fontSize: 14, color: 'var(--text)', background: '#fff', outline: 'none', fontFamily: 'inherit' },
  timeGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 },
  timeBtn: { padding: '8px 4px', borderRadius: 10, border: '1.5px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' },
  timeBtnActive: { background: 'var(--primary)', borderColor: 'var(--primary)', color: '#fff', fontWeight: 700 },
  doneBox: { padding: 40, textAlign: 'center' },
  resCard: { background: 'var(--primary-soft)', borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)' },
  resTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  resService: { fontWeight: 700, fontSize: 14, color: 'var(--text)' },
  resMeta: { fontSize: 12, color: 'var(--text-muted)', marginTop: 3 },
  center: { minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
}

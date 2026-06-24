import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import StarRating from '../components/StarRating'

const DESIGN_TYPES = ['전체 미용', '부분 미용', '목욕', '귀 청소', '발톱 정리', '스타일 컷', '기타']

export default function WritePostPage({ user }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', content: '', design_type: '', price: '',
    before_image_url: '', after_image_url: '', star_rating: 5,
  })
  const [loading, setLoading] = useState(false)

  if (!user) { navigate('/login'); return null }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.from('posts').insert([{
      title: form.title,
      content: form.content,
      design_type: form.design_type || null,
      price: form.price ? parseInt(form.price) : null,
      before_image_url: form.before_image_url || null,
      after_image_url: form.after_image_url || null,
      star_rating: form.star_rating,
      user_id: user.id,
    }]).select().single()

    if (!error) navigate(`/posts/${data.id}`)
    else { alert('오류가 발생했습니다.'); setLoading(false) }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.container}>
        <button className="btn btn-ghost" style={{ marginBottom: 16 }} onClick={() => navigate('/')}>← 목록으로</button>
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ marginBottom: 24, fontSize: 20 }}>✏️ 미용 후기 작성</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>제목 *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="미용 후기 제목을 입력하세요" required />

            <label style={styles.label}>디자인 종류</label>
            <select name="design_type" value={form.design_type} onChange={handleChange} style={styles.select}>
              <option value="">선택하세요</option>
              {DESIGN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <label style={styles.label}>가격 (원)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="예: 50000" />

            <label style={styles.label}>별점</label>
            <StarRating value={form.star_rating} onChange={(v) => setForm({ ...form, star_rating: v })} />

            <label style={styles.label}>미용 전 사진 URL</label>
            <input name="before_image_url" value={form.before_image_url} onChange={handleChange} placeholder="https://..." />

            <label style={styles.label}>미용 후 사진 URL</label>
            <input name="after_image_url" value={form.after_image_url} onChange={handleChange} placeholder="https://..." />

            <label style={styles.label}>내용 *</label>
            <textarea name="content" value={form.content} onChange={handleChange} placeholder="미용 후기를 자세히 써주세요" rows={8} required style={{ resize: 'vertical' }} />

            <div style={styles.btns}>
              <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>취소</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? '등록 중...' : '후기 등록'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: { minHeight: '100vh', paddingTop: 24 },
  container: { maxWidth: 660, margin: '0 auto', padding: '0 20px 40px' },
  form: { display: 'flex', flexDirection: 'column', gap: 10 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--text)', marginTop: 8 },
  select: { border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: 'var(--text)', background: '#fff', outline: 'none', fontFamily: 'inherit' },
  btns: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 },
}

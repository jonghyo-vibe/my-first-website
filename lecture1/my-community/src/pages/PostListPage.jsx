import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import StarRating from '../components/StarRating'

const formatDate = (iso) => {
  const d = new Date(iso)
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export default function PostListPage({ user }) {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [topPosts, setTopPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('latest')

  useEffect(() => { fetchPosts(); fetchTopPosts() }, [sortBy])

  const fetchPosts = async () => {
    setLoading(true)
    let query = supabase.from('posts').select('*, users(nickname), comments(count)')
    query = sortBy === 'likes'
      ? query.order('likes_count', { ascending: false })
      : query.order('created_at', { ascending: false })
    const { data } = await query
    setPosts(data || [])
    setLoading(false)
  }

  const fetchTopPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('id, title, likes_count, after_image_url, users(nickname)')
      .order('likes_count', { ascending: false })
      .limit(5)
    setTopPosts(data || [])
  }

  return (
    <div style={s.wrap}>
      {/* 히어로 */}
      <div style={s.hero}>
        <p style={s.heroEmoji}>🐾</p>
        <h1 style={s.heroTitle}>미용애옹</h1>
        <p style={s.heroSub}>반려동물 미용 커뮤니티 — 예쁜 미용 후기를 공유해요 💜</p>
        <div style={s.heroBtns}>
          <button className="btn btn-primary" onClick={() => navigate('/reservation')}>📅 예약하기</button>
          <button className="btn" style={s.btnWhite} onClick={() => navigate('/price')}>💰 가격표</button>
          <button className="btn" style={s.btnWhite} onClick={() => navigate('/designers')}>✂️ 디자이너</button>
        </div>
      </div>

      <div style={s.container}>
        {/* 좋아요 TOP 5 */}
        <div style={{ marginBottom: 36 }}>
          <p className="section-title">🏆 이번 주 인기 후기 TOP 5</p>
          <div style={s.rankList}>
            {topPosts.map((p, i) => (
              <div key={p.id} className="card" style={s.rankCard} onClick={() => navigate(`/posts/${p.id}`)}>
                <span style={{ ...s.rankNum, background: i === 0 ? '#f5a623' : i === 1 ? '#b0b0b0' : i === 2 ? '#cd7f32' : 'var(--primary-light)', color: i < 3 ? '#fff' : 'var(--primary-dark)' }}>{i + 1}</span>
                {p.after_image_url && <img src={p.after_image_url} alt="" style={s.rankThumb} />}
                <div style={s.rankInfo}>
                  <p style={s.rankTitle}>{p.title}</p>
                  <p style={s.rankMeta}>👤 {p.users?.nickname} &nbsp;❤️ {p.likes_count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 정렬 탭 */}
        <div style={s.tabs}>
          <p className="section-title" style={{ marginBottom: 0 }}>📸 미용 후기</p>
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', alignItems: 'center' }}>
            <button className={`btn ${sortBy === 'latest' ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setSortBy('latest')}>최신순</button>
            <button className={`btn ${sortBy === 'likes' ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setSortBy('likes')}>인기순</button>
            {user && <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => navigate('/write')}>✏️ 글쓰기</button>}
          </div>
        </div>

        {/* Masonry 게시물 목록 */}
        {loading ? (
          <div style={s.empty}>불러오는 중... 🐶</div>
        ) : posts.length === 0 ? (
          <div style={s.empty}>아직 게시물이 없어요. 첫 번째 후기를 남겨보세요! 🐾</div>
        ) : (
          <div className="masonry">
            {posts.map((post) => (
              <div key={post.id} className="masonry-item">
                <div className="card" style={s.card} onClick={() => navigate(`/posts/${post.id}`)}>
                  {post.after_image_url && (
                    <div style={s.imgWrap}>
                      <img src={post.after_image_url} alt="미용 후" style={s.thumb} />
                      {post.design_type && <span className="tag" style={s.imgTag}>{post.design_type}</span>}
                    </div>
                  )}
                  <div style={s.body}>
                    <h3 style={s.title}>{post.title}</h3>
                    <p style={s.content}>{post.content}</p>
                    <div style={s.meta}>
                      <StarRating value={post.star_rating} readOnly />
                      {post.price && <span style={s.price}>₩{post.price.toLocaleString()}</span>}
                    </div>
                    <div style={s.footer}>
                      <span style={s.nick}>👤 {post.users?.nickname}</span>
                      <span style={s.date}>🕐 {formatDate(post.created_at)}</span>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
                        <span style={s.stat}>❤️ {post.likes_count}</span>
                        <span style={s.stat}>💬 {post.comments?.[0]?.count ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  wrap: { minHeight: '100vh' },
  hero: {
    background: 'linear-gradient(145deg, #c9b8f0 0%, #b39ddb 50%, #9575cd 100%)',
    padding: '60px 20px 48px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroEmoji: { fontSize: 48, marginBottom: 8 },
  heroTitle: { fontSize: 42, fontWeight: 900, color: '#fff', marginBottom: 10, textShadow: '0 2px 12px rgba(0,0,0,0.15)' },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 15, marginBottom: 28 },
  heroBtns: { display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' },
  btnWhite: { background: 'rgba(255,255,255,0.25)', color: '#fff', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.4)', fontWeight: 700 },
  container: { maxWidth: 1100, margin: '0 auto', padding: '32px 20px 48px' },
  rankList: { display: 'flex', flexDirection: 'column', gap: 8 },
  rankCard: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer', borderRadius: 14 },
  rankNum: { width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, flexShrink: 0 },
  rankThumb: { width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 },
  rankInfo: { flex: 1, minWidth: 0 },
  rankTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  rankMeta: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  tabs: { display: 'flex', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 },
  card: { cursor: 'pointer', overflow: 'hidden' },
  imgWrap: { position: 'relative' },
  thumb: { width: '100%', display: 'block', objectFit: 'cover' },
  imgTag: { position: 'absolute', bottom: 8, left: 8 },
  body: { padding: '12px 14px 14px' },
  title: { fontSize: 14, fontWeight: 700, marginBottom: 5, color: 'var(--text)', lineHeight: 1.4 },
  content: { fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  meta: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  price: { fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)' },
  footer: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: 8 },
  nick: { fontSize: 11, color: 'var(--text-muted)' },
  date: { fontSize: 11, color: 'var(--text-muted)' },
  stat: { fontSize: 12, color: 'var(--text-muted)' },
  empty: { textAlign: 'center', color: 'var(--text-muted)', padding: '60px 20px', fontSize: 16 },
}

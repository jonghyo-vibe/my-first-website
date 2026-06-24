import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import StarRating from '../components/StarRating'

const formatDate = (iso) => {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export default function PostListPage({ user }) {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('latest')

  useEffect(() => {
    fetchPosts()
  }, [sortBy])

  const fetchPosts = async () => {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select('*, users(nickname), comments(count)')

    if (sortBy === 'likes') query = query.order('likes_count', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data } = await query
    setPosts(data || [])
    setLoading(false)
  }

  return (
    <div style={styles.wrap}>
      {/* 히어로 배너 */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>🐾 미용애옹</h1>
          <p style={styles.heroSub}>반려동물 미용 전문 커뮤니티 — 예쁜 미용 후기를 공유해요</p>
        </div>
      </div>

      <div style={styles.container}>
        {/* 정렬 탭 */}
        <div style={styles.tabs}>
          <button className={`btn ${sortBy === 'latest' ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 13 }} onClick={() => setSortBy('latest')}>최신순</button>
          <button className={`btn ${sortBy === 'likes' ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 13 }} onClick={() => setSortBy('likes')}>좋아요순</button>
          {user && (
            <button className="btn btn-outline" style={{ fontSize: 13, marginLeft: 'auto' }} onClick={() => navigate('/write')}>✏️ 글쓰기</button>
          )}
        </div>

        {/* 게시물 목록 */}
        {loading ? (
          <div style={styles.empty}>불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div style={styles.empty}>아직 게시물이 없습니다. 첫 번째 후기를 남겨보세요! 🐶</div>
        ) : (
          <div style={styles.grid}>
            {posts.map((post) => (
              <div key={post.id} className="card" style={styles.card} onClick={() => navigate(`/posts/${post.id}`)}>
                {post.after_image_url && (
                  <img src={post.after_image_url} alt="미용 후" style={styles.thumb} />
                )}
                <div style={styles.cardBody}>
                  <div style={styles.cardTop}>
                    {post.design_type && <span style={styles.tag}>{post.design_type}</span>}
                    {post.price && <span style={styles.price}>₩{post.price.toLocaleString()}</span>}
                  </div>
                  <h3 style={styles.title}>{post.title}</h3>
                  <p style={styles.content}>{post.content}</p>
                  <div style={styles.meta}>
                    <StarRating value={post.star_rating} readOnly />
                    <span style={styles.metaText}>👤 {post.users?.nickname}</span>
                    <span style={styles.metaText}>🕐 {formatDate(post.created_at)}</span>
                  </div>
                  <div style={styles.stats}>
                    <span style={styles.stat}>❤️ {post.likes_count}</span>
                    <span style={styles.stat}>💬 {post.comments?.[0]?.count ?? 0}</span>
                    <span style={styles.stat}>🔗 {post.shares_count}</span>
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

const styles = {
  wrap: { minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)', padding: '48px 20px', textAlign: 'center' },
  heroText: {},
  heroTitle: { fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 8 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 15 },
  container: { maxWidth: 900, margin: '0 auto', padding: '24px 20px' },
  tabs: { display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  card: { cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' },
  thumb: { width: '100%', height: 180, objectFit: 'cover' },
  cardBody: { padding: 16 },
  cardTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  tag: { background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600 },
  price: { color: 'var(--primary-dark)', fontSize: 12, fontWeight: 600 },
  title: { fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--text)' },
  content: { fontSize: 13, color: 'var(--text-muted)', marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  meta: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' },
  metaText: { fontSize: 12, color: 'var(--text-muted)' },
  stats: { display: 'flex', gap: 12 },
  stat: { fontSize: 13, color: 'var(--text-muted)' },
  empty: { textAlign: 'center', color: 'var(--text-muted)', padding: '60px 20px', fontSize: 15 },
}

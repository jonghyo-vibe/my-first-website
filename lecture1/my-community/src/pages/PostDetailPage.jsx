import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import StarRating from '../components/StarRating'
import CommentSection from '../components/CommentSection'

const formatDate = (iso) => {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export default function PostDetailPage({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPost() }, [id])

  const fetchPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, users(nickname)')
      .eq('id', id)
      .single()
    setPost(data)
    setLoading(false)

    if (user) {
      const { data: likeData } = await supabase
        .from('post_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', id)
        .single()
      setLiked(!!likeData)
    }
  }

  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    if (liked) {
      await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', id)
      await supabase.from('posts').update({ likes_count: post.likes_count - 1 }).eq('id', id)
      setPost({ ...post, likes_count: post.likes_count - 1 })
      setLiked(false)
    } else {
      await supabase.from('post_likes').insert({ user_id: user.id, post_id: id })
      await supabase.from('posts').update({ likes_count: post.likes_count + 1 }).eq('id', id)
      setPost({ ...post, likes_count: post.likes_count + 1 })
      setLiked(true)
    }
  }

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    await supabase.from('posts').update({ shares_count: post.shares_count + 1 }).eq('id', id)
    setPost({ ...post, shares_count: post.shares_count + 1 })
    alert('링크가 복사됐습니다!')
  }

  const handleDelete = async () => {
    if (!confirm('게시물을 삭제할까요?')) return
    await supabase.from('posts').delete().eq('id', id)
    navigate('/')
  }

  if (loading) return <div style={styles.loading}>불러오는 중...</div>
  if (!post) return <div style={styles.loading}>게시물을 찾을 수 없습니다.</div>

  return (
    <div style={styles.wrap}>
      <div style={styles.container}>
        <button className="btn btn-ghost" style={{ marginBottom: 16 }} onClick={() => navigate('/')}>← 목록으로</button>

        <div className="card" style={styles.card}>
          {/* 전후 비교 사진 */}
          {(post.before_image_url || post.after_image_url) && (
            <div style={styles.imageRow}>
              {post.before_image_url && (
                <div style={styles.imageBox}>
                  <p style={styles.imageLabel}>미용 전 🐶</p>
                  <img src={post.before_image_url} alt="전" style={styles.image} />
                </div>
              )}
              {post.after_image_url && (
                <div style={styles.imageBox}>
                  <p style={styles.imageLabel}>미용 후 ✨</p>
                  <img src={post.after_image_url} alt="후" style={styles.image} />
                </div>
              )}
            </div>
          )}

          <div style={styles.body}>
            {/* 태그/가격 */}
            <div style={styles.tagRow}>
              {post.design_type && <span style={styles.tag}>{post.design_type}</span>}
              {post.price && <span style={styles.price}>₩{post.price.toLocaleString()}</span>}
            </div>

            <h1 style={styles.title}>{post.title}</h1>

            <div style={styles.meta}>
              <StarRating value={post.star_rating} readOnly />
              <span style={styles.metaText}>👤 {post.users?.nickname}</span>
              <span style={styles.metaText}>🕐 {formatDate(post.created_at)}</span>
              {post.updated_at !== post.created_at && (
                <span style={styles.metaText}>(수정됨)</span>
              )}
            </div>

            <p style={styles.content}>{post.content}</p>

            {/* 액션 버튼 */}
            <div style={styles.actions}>
              <button className="btn btn-ghost" style={liked ? styles.likedBtn : {}} onClick={handleLike}>
                {liked ? '❤️' : '🤍'} 좋아요 {post.likes_count}
              </button>
              <button className="btn btn-ghost" onClick={handleShare}>
                🔗 공유 {post.shares_count}
              </button>
              {user && user.id === post.user_id && (
                <>
                  <button className="btn btn-ghost" onClick={() => navigate(`/edit/${post.id}`)}>✏️ 수정</button>
                  <button className="btn btn-ghost" style={{ color: 'var(--error)' }} onClick={handleDelete}>🗑️ 삭제</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <CommentSection postId={id} user={user} />
      </div>
    </div>
  )
}

const styles = {
  wrap: { minHeight: '100vh', paddingTop: 24 },
  container: { maxWidth: 740, margin: '0 auto', padding: '0 20px 40px' },
  loading: { textAlign: 'center', padding: 60, color: 'var(--text-muted)' },
  card: { overflow: 'hidden', marginBottom: 24 },
  imageRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 },
  imageBox: { position: 'relative' },
  imageLabel: { position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 12, padding: '2px 8px', borderRadius: 20, zIndex: 1 },
  image: { width: '100%', height: 260, objectFit: 'cover', display: 'block' },
  body: { padding: 24 },
  tagRow: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 },
  tag: { background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600 },
  price: { color: 'var(--primary-dark)', fontWeight: 700, fontSize: 15 },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 12 },
  meta: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  metaText: { fontSize: 13, color: 'var(--text-muted)' },
  content: { fontSize: 15, lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap', marginBottom: 24 },
  actions: { display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: 16 },
  likedBtn: { color: '#e05c7a' },
}

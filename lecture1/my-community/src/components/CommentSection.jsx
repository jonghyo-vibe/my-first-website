import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const formatDate = (iso) => {
  const d = new Date(iso)
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

function CommentItem({ comment, user, onRefresh, depth = 0 }) {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const [replyText, setReplyText] = useState('')
  const [showReply, setShowReply] = useState(false)
  const [liked, setLiked] = useState(false)

  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    if (liked) {
      await supabase.from('comment_likes').delete().eq('user_id', user.id).eq('comment_id', comment.id)
      await supabase.from('comments').update({ likes_count: comment.likes_count - 1 }).eq('id', comment.id)
    } else {
      await supabase.from('comment_likes').insert({ user_id: user.id, comment_id: comment.id })
      await supabase.from('comments').update({ likes_count: comment.likes_count + 1 }).eq('id', comment.id)
    }
    setLiked(!liked)
    onRefresh()
  }

  const handleEdit = async () => {
    await supabase.from('comments').update({ content: editText }).eq('id', comment.id)
    setEditing(false)
    onRefresh()
  }

  const handleDelete = async () => {
    if (!confirm('댓글을 삭제할까요?')) return
    await supabase.from('comments').delete().eq('id', comment.id)
    onRefresh()
  }

  const handleReply = async () => {
    if (!replyText.trim()) return
    await supabase.from('comments').insert({
      content: replyText,
      user_id: user.id,
      post_id: comment.post_id,
      parent_id: comment.id,
    })
    setReplyText('')
    setShowReply(false)
    onRefresh()
  }

  return (
    <div style={{ ...styles.item, marginLeft: depth * 28, borderLeft: depth > 0 ? '2px solid var(--primary-light)' : 'none', paddingLeft: depth > 0 ? 12 : 0 }}>
      <div style={styles.header}>
        <span style={styles.nick}>👤 {comment.users?.nickname}</span>
        <span style={styles.date}>{formatDate(comment.created_at)}</span>
      </div>

      {editing ? (
        <div style={styles.editBox}>
          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2} style={{ resize: 'vertical' }} />
          <div style={styles.editBtns}>
            <button className="btn btn-primary" style={{ fontSize: 12, padding: '4px 12px' }} onClick={handleEdit}>저장</button>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setEditing(false)}>취소</button>
          </div>
        </div>
      ) : (
        <p style={styles.content}>{comment.content}</p>
      )}

      <div style={styles.actions}>
        <button className="btn btn-ghost" style={liked ? { color: '#e05c7a', fontSize: 12 } : { fontSize: 12 }} onClick={handleLike}>
          {liked ? '❤️' : '🤍'} {comment.likes_count}
        </button>
        {depth === 0 && (
          <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setShowReply(!showReply)}>💬 답글</button>
        )}
        {user && user.id === comment.user_id && (
          <>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setEditing(true)}>✏️ 수정</button>
            <button className="btn btn-ghost" style={{ fontSize: 12, color: 'var(--error)' }} onClick={handleDelete}>🗑️ 삭제</button>
          </>
        )}
      </div>

      {showReply && user && (
        <div style={styles.replyBox}>
          <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="답글을 입력하세요" rows={2} style={{ resize: 'vertical' }} />
          <button className="btn btn-primary" style={{ fontSize: 12, padding: '4px 12px', marginTop: 6 }} onClick={handleReply}>답글 등록</button>
        </div>
      )}

      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} user={user} onRefresh={onRefresh} depth={depth + 1} />
      ))}
    </div>
  )
}

export default function CommentSection({ postId, user }) {
  const navigate = useNavigate()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => { fetchComments() }, [postId])

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, users(nickname)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    const roots = (data || []).filter((c) => !c.parent_id)
    const replies = (data || []).filter((c) => c.parent_id)
    roots.forEach((r) => { r.replies = replies.filter((rep) => rep.parent_id === r.id) })
    setComments(roots)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!text.trim()) return
    await supabase.from('comments').insert({ content: text, user_id: user.id, post_id: postId })
    setText('')
    fetchComments()
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ marginBottom: 20, fontSize: 16 }}>💬 댓글 {comments.length}개</h3>

      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} user={user} onRefresh={fetchComments} />
      ))}

      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={user ? '댓글을 입력하세요' : '로그인 후 댓글을 작성할 수 있습니다'}
          rows={3}
          disabled={!user}
          style={{ resize: 'vertical' }}
        />
        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', marginTop: 8 }}>등록</button>
      </form>
    </div>
  )
}

const styles = {
  item: { paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--border)' },
  header: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 },
  nick: { fontSize: 13, fontWeight: 600, color: 'var(--primary-dark)' },
  date: { fontSize: 11, color: 'var(--text-muted)' },
  content: { fontSize: 14, lineHeight: 1.6, color: 'var(--text)', whiteSpace: 'pre-wrap' },
  actions: { display: 'flex', gap: 4, marginTop: 6 },
  editBox: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 6 },
  editBtns: { display: 'flex', gap: 6 },
  replyBox: { marginTop: 8, display: 'flex', flexDirection: 'column' },
  form: { marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column' },
}

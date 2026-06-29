import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import BottomTabNav from '../components/layout/BottomTabNav'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { supabase } from '../lib/supabase'
import { useAuth } from '../store/authContext'
import type { SnsPost, SnsComment } from '../types'
import { ROOM_SIZE_LABELS } from '../types'
import { FiHeart, FiMessageCircle, FiSend } from 'react-icons/fi'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [post, setPost] = useState<SnsPost | null>(null)
  const [comments, setComments] = useState<SnsComment[]>([])
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      supabase.from('sns_posts').select('*, sns_users(*)').eq('id', id).single(),
      supabase.from('sns_comments').select('*, sns_users(display_name,avatar_url)')
        .eq('post_id', id).order('created_at'),
    ]).then(([postRes, commentsRes]) => {
      if (postRes.data) {
        setPost(postRes.data)
        setLikesCount(postRes.data.likes_count)
      }
      setComments(commentsRes.data ?? [])
      setLoading(false)
    })
    if (currentUser && id) {
      supabase.from('sns_likes').select('id').eq('post_id', id).eq('user_id', currentUser.id).single()
        .then(({ data }) => { if (data) setLiked(true) })
    }
  }, [id, currentUser])

  async function handleLike() {
    if (!currentUser || !post) return
    if (liked) {
      await supabase.from('sns_likes').delete().eq('post_id', post.id).eq('user_id', currentUser.id)
      await supabase.from('sns_posts').update({ likes_count: likesCount - 1 }).eq('id', post.id)
      setLikesCount(p => p - 1)
    } else {
      await supabase.from('sns_likes').insert({ post_id: post.id, user_id: currentUser.id })
      await supabase.from('sns_posts').update({ likes_count: likesCount + 1 }).eq('id', post.id)
      setLikesCount(p => p + 1)
    }
    setLiked(!liked)
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!currentUser || !post || !commentText.trim()) return
    const { data } = await supabase.from('sns_comments')
      .insert({ post_id: post.id, user_id: currentUser.id, content: commentText.trim() })
      .select('*, sns_users(display_name,avatar_url)').single()
    if (data) setComments(p => [...p, data])
    setCommentText('')
  }

  if (loading) return <div className="flex flex-col min-h-screen"><Header showBack title="게시물" /><LoadingSpinner /></div>
  if (!post) return <div className="flex flex-col min-h-screen"><Header showBack title="게시물" /><div className="text-center py-20 text-slate-400">게시물을 찾을 수 없습니다.</div></div>

  const user = post.sns_users

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header showBack title="게시물" />

      <main className="flex-1 page-content">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-violet-100">
          <img
            src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-slate-800">{user?.display_name ?? '익명'}</p>
            <p className="text-slate-400 text-xs">{new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <span className="ml-auto text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">
            {ROOM_SIZE_LABELS[post.room_size]}
          </span>
        </div>

        {/* 이미지 */}
        <img src={post.image_url} alt={post.caption} className="w-full aspect-square object-cover" />

        {/* 좋아요/댓글 액션 */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-violet-100">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-rose-500' : 'text-slate-500'}`}>
            <FiHeart className={`w-5 h-5 ${liked ? 'fill-rose-500' : ''}`} />
            {likesCount}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
            <FiMessageCircle className="w-5 h-5" />
            {comments.length}
          </button>
          {!currentUser && (
            <button onClick={() => navigate('/login')} className="ml-auto text-xs text-indigo-500 font-medium">
              로그인하고 좋아요 남기기
            </button>
          )}
        </div>

        {/* 캡션 */}
        <div className="px-4 py-3 border-b border-violet-100">
          <p className="text-slate-800 text-sm leading-relaxed">{post.caption}</p>
        </div>

        {/* 댓글 목록 */}
        <div className="px-4 py-3">
          <p className="font-semibold text-slate-700 text-sm mb-3">댓글 {comments.length}개</p>
          {comments.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">첫 번째 댓글을 남겨보세요!</p>
          ) : (
            <div className="space-y-3">
              {comments.map(c => (
                <div key={c.id} className="flex gap-2">
                  <img
                    src={c.sns_users?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user_id}`}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-violet-50 rounded-2xl px-3 py-2">
                      <p className="font-medium text-slate-800 text-xs">{c.sns_users?.display_name ?? '익명'}</p>
                      <p className="text-slate-700 text-sm mt-0.5">{c.content}</p>
                    </div>
                    <p className="text-slate-400 text-[10px] mt-1 ml-2">{new Date(c.created_at).toLocaleDateString('ko-KR')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 댓글 입력 */}
      {currentUser && (
        <form
          onSubmit={handleComment}
          className="sticky bottom-[70px] bg-white border-t border-violet-100 px-4 py-3 flex gap-2"
        >
          <input
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="flex-1 bg-violet-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="w-9 h-9 bg-indigo-500 text-white rounded-full flex items-center justify-center disabled:opacity-40"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </form>
      )}

      <BottomTabNav />
    </div>
  )
}

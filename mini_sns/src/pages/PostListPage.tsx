import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import BottomTabNav from '../components/layout/BottomTabNav'
import FurnitureCard from '../components/furniture/FurnitureCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { supabase } from '../lib/supabase'
import type { Furniture, SnsPost, RoomSize } from '../types'
import { ROOM_SIZE_LABELS } from '../types'
import { FiFilter, FiGrid, FiList } from 'react-icons/fi'

type TabType = 'furniture' | 'interior'

export default function PostListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initCategory = searchParams.get('category') ?? ''

  const [tab, setTab] = useState<TabType>('furniture')
  const [roomSize, setRoomSize] = useState<RoomSize>('all')
  const [category, setCategory] = useState(initCategory)
  const [viewGrid, setViewGrid] = useState(true)
  const [furniture, setFurniture] = useState<Furniture[]>([])
  const [posts, setPosts] = useState<SnsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  const categories = ['전체', '소파', '침대', '식탁', '책상', '옷장', '책장', 'TV장', '테이블', '조명']
  const roomSizes = Object.entries(ROOM_SIZE_LABELS) as [RoomSize, string][]

  useEffect(() => {
    setLoading(true)
    if (tab === 'furniture') {
      let q = supabase.from('sns_furniture').select('*')
      if (roomSize !== 'all') q = q.or(`room_size_fit.eq.${roomSize},room_size_fit.eq.all`)
      if (category && category !== '전체') q = q.eq('category', category)
      q.order('monthly_rank', { ascending: true, nullsFirst: false })
        .then(({ data }) => { setFurniture(data ?? []); setLoading(false) })
    } else {
      let q = supabase.from('sns_posts').select('*, sns_users(display_name,avatar_url)')
        .order('created_at', { ascending: false })
      if (roomSize !== 'all') q = q.eq('room_size', roomSize)
      q.then(({ data }) => { setPosts(data ?? []); setLoading(false) })
    }
  }, [tab, roomSize, category])

  return (
    <div className="flex flex-col min-h-screen bg-violet-50">
      <Header title="둘러보기" />

      <div className="bg-white border-b border-violet-100 sticky top-14 z-40">
        {/* 탭 */}
        <div className="flex px-4 pt-3 gap-4">
          {(['furniture', 'interior'] as TabType[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${
                tab === t ? 'text-indigo-500 border-indigo-500' : 'text-slate-400 border-transparent'
              }`}
            >
              {t === 'furniture' ? '가구 쇼핑' : '인테리어 피드'}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-1 pb-2 text-slate-500 text-xs"
          >
            <FiFilter className="w-3.5 h-3.5" />
            필터
          </button>
          {tab === 'furniture' && (
            <button onClick={() => setViewGrid(!viewGrid)} className="pb-2 text-slate-500">
              {viewGrid ? <FiList className="w-4 h-4" /> : <FiGrid className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* 집 규격 선택 */}
        {showFilter && (
          <div className="px-4 pb-3 space-y-2">
            <p className="text-xs font-semibold text-slate-600">집 규격 선택</p>
            <div className="flex flex-wrap gap-2">
              {roomSizes.map(([size, label]) => (
                <button
                  key={size}
                  onClick={() => setRoomSize(size)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    roomSize === size
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-white text-slate-600 border-violet-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === 'furniture' && (
              <>
                <p className="text-xs font-semibold text-slate-600">카테고리</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat === '전체' ? '' : cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        (cat === '전체' && !category) || cat === category
                          ? 'bg-indigo-500 text-white border-indigo-500'
                          : 'bg-white text-slate-600 border-violet-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 카테고리 빠른 스크롤 (가구 탭) */}
        {tab === 'furniture' && !showFilter && (
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat === '전체' ? '' : cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  (cat === '전체' && !category) || cat === category
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : 'bg-white text-slate-600 border-violet-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <main className="flex-1 p-4 page-content">
        {loading ? (
          <LoadingSpinner />
        ) : tab === 'furniture' ? (
          <>
            {furniture.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="text-4xl mb-3">🛋️</p>
                <p className="font-medium">조건에 맞는 가구가 없어요</p>
              </div>
            ) : viewGrid ? (
              <div className="grid grid-cols-2 gap-3">
                {furniture.map(item => (
                  <FurnitureCard key={item.id} item={item} showRank />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {furniture.map(item => (
                  <FurnitureListItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="text-4xl mb-3">📷</p>
                <p className="font-medium">아직 게시물이 없어요</p>
                <button onClick={() => navigate('/posts/create')} className="mt-3 text-indigo-500 text-sm font-medium">
                  첫 번째 인테리어 공유하기
                </button>
              </div>
            ) : (
              posts.map(post => <PostCard key={post.id} post={post} />)
            )}
          </div>
        )}
      </main>
      <BottomTabNav />
    </div>
  )
}

function FurnitureListItem({ item }: { item: Furniture }) {
  const discountRate = item.original_price
    ? Math.round((1 - item.price / item.original_price) * 100)
    : 0
  return (
    <div
      className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm border border-violet-100 cursor-pointer"
      onClick={() => {}}
    >
      <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-xs">{item.category}</p>
        <p className="font-medium text-slate-800 text-sm line-clamp-2 leading-tight">{item.name}</p>
        <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">{item.description}</p>
        <div className="flex items-center gap-2 mt-1">
          {item.original_price && <span className="text-rose-500 text-xs font-bold">{discountRate}%</span>}
          <span className="font-bold text-slate-900 text-sm">{item.price.toLocaleString()}원</span>
          {item.original_price && (
            <span className="text-slate-400 text-xs line-through">{item.original_price.toLocaleString()}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-yellow-400 text-[10px]">★</span>
          <span className="text-slate-500 text-[10px]">{item.rating} ({item.review_count})</span>
        </div>
      </div>
    </div>
  )
}

function PostCard({ post }: { post: SnsPost }) {
  const navigate = useNavigate()
  const user = post.sns_users
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-violet-100">
      <div className="flex items-center gap-2 p-3">
        <img
          src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-slate-800 text-sm">{user?.display_name ?? '익명'}</p>
          <p className="text-slate-400 text-[10px]">{new Date(post.created_at).toLocaleDateString('ko-KR')}</p>
        </div>
      </div>
      <img
        src={post.image_url}
        alt={post.caption}
        className="w-full aspect-square object-cover cursor-pointer"
        onClick={() => navigate(`/posts/${post.id}`)}
      />
      <div className="p-3">
        <p className="text-slate-700 text-sm line-clamp-2">{post.caption}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
            {ROOM_SIZE_LABELS[post.room_size]}
          </span>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <span>♥</span>
            <span>{post.likes_count}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

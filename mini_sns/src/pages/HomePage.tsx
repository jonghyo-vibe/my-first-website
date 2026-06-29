import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import BottomTabNav from '../components/layout/BottomTabNav'
import HeroSection from '../components/home/HeroSection'
import MonthlyRanking from '../components/home/MonthlyRanking'
import FurnitureCard from '../components/furniture/FurnitureCard'
import { supabase } from '../lib/supabase'
import type { Furniture, SnsPost } from '../types'

const CATEGORIES = [
  { label: '소파',  emoji: '🛋️' },
  { label: '침대',  emoji: '🛏️' },
  { label: '식탁',  emoji: '🍽️' },
  { label: '책상',  emoji: '💻' },
  { label: '옷장',  emoji: '👔' },
  { label: '책장',  emoji: '📚' },
  { label: 'TV장',  emoji: '📺' },
  { label: '조명',  emoji: '💡' },
]

const STYLES = [
  { label: '모던',    photoId: '1600566752229-250ed79470f8', color: 'from-slate-700' },
  { label: '북유럽',  photoId: '1505693416388-ac5ce068fe85', color: 'from-indigo-800' },
  { label: '내추럴',  photoId: '1586023492125-27b2c045efd7', color: 'from-amber-800' },
  { label: '빈티지',  photoId: '1567538096630-e0c55bd6374c', color: 'from-stone-700' },
  { label: '미니멀',  photoId: '1484101403633-562f891dc89a', color: 'from-zinc-800' },
  { label: '클래식',  photoId: '1598928506311-c55ded91a20c', color: 'from-yellow-900' },
]

interface Creator {
  id: string
  display_name: string
  avatar_url: string | null
  bio: string | null
}

export default function HomePage() {
  const navigate = useNavigate()
  const [eventFurniture, setEventFurniture] = useState<Furniture[]>([])
  const [popularFurniture, setPopularFurniture] = useState<Furniture[]>([])
  const [recentPosts, setRecentPosts] = useState<SnsPost[]>([])
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('sns_furniture').select('*').eq('is_event', true).limit(4),
      supabase.from('sns_furniture').select('*').order('review_count', { ascending: false }).limit(6),
      supabase.from('sns_posts').select('*, sns_users(display_name,avatar_url)')
        .order('created_at', { ascending: false }).limit(6),
      supabase.from('sns_users').select('id,display_name,avatar_url,bio').limit(8),
    ]).then(([evRes, popRes, postRes, crRes]) => {
      if (evRes.data)   setEventFurniture(evRes.data)
      if (popRes.data)  setPopularFurniture(popRes.data)
      if (postRes.data) setRecentPosts(postRes.data)
      if (crRes.data)   setCreators(crRes.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-violet-50">
      <Header />

      <main className="flex-1 page-content">

        {/* ① 히어로 슬라이더 */}
        <section>
          <HeroSection />
        </section>

        {/* ② 순위 */}
        <section className="px-4 pt-4 pb-2">
          <MonthlyRanking />
        </section>

        {/* ③ 이벤트 배너 */}
        <section className="px-4 py-3">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-400 to-indigo-600 p-4 flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-xs mb-1">🎉 이달의 특가</p>
              <p className="text-white font-bold text-base">봄 인테리어 최대 30% 할인</p>
              <p className="text-indigo-100 text-xs mt-1">6월 30일까지 한정</p>
            </div>
            <button
              onClick={() => navigate('/posts')}
              className="px-4 py-2 bg-white text-indigo-600 text-xs font-bold rounded-full flex-shrink-0"
            >
              보러가기
            </button>
          </div>
        </section>

        {/* ④ 카테고리 퀵메뉴 — 특가 가구 위 */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 text-base">카테고리</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => navigate(`/posts?category=${cat.label}`)}
                className="flex flex-col items-center gap-1 py-3 bg-white rounded-2xl active:bg-indigo-50 border border-violet-100 transition-colors"
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-xs text-slate-600 font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ⑤ 스타일 탐색 — 가로 스크롤 */}
        <section className="py-3">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-bold text-slate-800 text-base">스타일 탐색</h2>
            <button onClick={() => navigate('/posts')} className="text-indigo-500 text-xs font-medium">전체보기</button>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-1">
            {STYLES.map(s => (
              <button
                key={s.label}
                onClick={() => navigate('/posts')}
                className="flex-shrink-0 relative w-24 h-28 rounded-2xl overflow-hidden shadow-sm"
              >
                <img
                  src={`https://images.unsplash.com/photo-${s.photoId}?w=200&h=230&fit=crop&auto=format`}
                  alt={s.label}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${s.color}/70 to-transparent`} />
                <span className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-bold drop-shadow">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ⑥ 특가 가구 */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 text-base">특가 가구</h2>
            <button onClick={() => navigate('/posts')} className="text-indigo-500 text-xs font-medium">전체보기</button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-violet-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-violet-200 rounded w-3/4" />
                    <div className="h-3 bg-violet-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {eventFurniture.map(item => (
                <FurnitureCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* ⑦ 인기 가구 — 가로 스크롤 */}
        <section className="py-3">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-bold text-slate-800 text-base">인기 가구 TOP 6</h2>
            <button onClick={() => navigate('/posts')} className="text-indigo-500 text-xs font-medium">더보기</button>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-1">
            {loading
              ? [1,2,3,4].map(i => (
                  <div key={i} className="flex-shrink-0 w-36 bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="w-36 h-36 bg-violet-200" />
                    <div className="p-2 space-y-1.5">
                      <div className="h-2.5 bg-violet-200 rounded w-3/4" />
                      <div className="h-2.5 bg-violet-100 rounded w-1/2" />
                    </div>
                  </div>
                ))
              : popularFurniture.map(item => {
                  const disc = item.original_price
                    ? Math.round((1 - item.price / item.original_price) * 100) : 0
                  return (
                    <div key={item.id} className="flex-shrink-0 w-36 bg-white rounded-2xl overflow-hidden shadow-sm border border-violet-100">
                      <div className="relative">
                        <img src={item.image_url} alt={item.name} className="w-36 h-36 object-cover" />
                        {disc > 0 && (
                          <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {disc}%
                          </span>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] text-slate-400">{item.category}</p>
                        <p className="text-xs font-medium text-slate-800 line-clamp-1 leading-tight">{item.name}</p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">{item.price.toLocaleString()}원</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          <span className="text-yellow-400 text-[10px]">★</span>
                          <span className="text-slate-400 text-[10px]">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
            }
          </div>
        </section>

        {/* ⑧ 인기 크리에이터 */}
        <section className="py-3 bg-white border-y border-violet-100">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-bold text-slate-800 text-base">인기 크리에이터</h2>
          </div>
          <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide pb-1">
            {loading
              ? [1,2,3,4,5].map(i => (
                  <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5 animate-pulse">
                    <div className="w-14 h-14 bg-violet-200 rounded-full" />
                    <div className="h-2 bg-violet-200 rounded w-12" />
                  </div>
                ))
              : creators.map(c => (
                  <div key={c.id} className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <div className="w-14 h-14 rounded-full ring-2 ring-indigo-200 overflow-hidden">
                      <img
                        src={c.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`}
                        alt={c.display_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium text-center w-16 truncate">{c.display_name}</p>
                  </div>
                ))
            }
          </div>
        </section>

        {/* ⑨ 최근 인테리어 피드 */}
        <section className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 text-base">최근 인테리어</h2>
            <button onClick={() => navigate('/posts')} className="text-indigo-500 text-xs font-medium">더보기</button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {recentPosts.map(post => (
              <div
                key={post.id}
                className="relative rounded-xl overflow-hidden cursor-pointer group"
                style={{ aspectRatio: '1' }}
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <img
                  src={post.image_url}
                  alt={post.caption}
                  className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5">
                  <span className="text-white text-[9px]">♥ {post.likes_count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <BottomTabNav />
    </div>
  )
}

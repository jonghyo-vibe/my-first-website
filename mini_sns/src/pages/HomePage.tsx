import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import BottomTabNav from '../components/layout/BottomTabNav'
import HeroSection from '../components/home/HeroSection'
import MonthlyRanking from '../components/home/MonthlyRanking'
import FurnitureCard from '../components/furniture/FurnitureCard'
import { supabase } from '../lib/supabase'
import type { Furniture, SnsPost } from '../types'

export default function HomePage() {
  const navigate = useNavigate()
  const [furniture, setFurniture] = useState<Furniture[]>([])
  const [recentPosts, setRecentPosts] = useState<SnsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('sns_furniture').select('*').eq('is_event', true).limit(4),
      supabase.from('sns_posts').select('*, sns_users(display_name,avatar_url)')
        .order('created_at', { ascending: false }).limit(4),
    ]).then(([furRes, postRes]) => {
      if (furRes.data) setFurniture(furRes.data)
      if (postRes.data) setRecentPosts(postRes.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 page-content">
        {/* 히어로 - 전체 폭 */}
        <section>
          <HeroSection />
        </section>

        {/* 순위 */}
        <section className="px-4 pt-4 pb-2">
          <MonthlyRanking />
        </section>

        {/* 이벤트 배너 */}
        <section className="px-4 py-3">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-sky-400 to-sky-600 p-4 flex items-center justify-between">
            <div>
              <p className="text-sky-100 text-xs mb-1">🎉 이달의 특가</p>
              <p className="text-white font-bold text-base">봄 인테리어 최대 30% 할인</p>
              <p className="text-sky-100 text-xs mt-1">6월 30일까지 한정</p>
            </div>
            <button
              onClick={() => navigate('/posts')}
              className="px-4 py-2 bg-white text-sky-600 text-xs font-bold rounded-full flex-shrink-0"
            >
              보러가기
            </button>
          </div>
        </section>

        {/* 이벤트 가구 */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 text-base">특가 가구</h2>
            <button onClick={() => navigate('/posts')} className="text-sky-500 text-xs font-medium">전체보기</button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-slate-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {furniture.map(item => (
                <FurnitureCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* 최근 인테리어 피드 */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 text-base">최근 인테리어</h2>
            <button onClick={() => navigate('/posts')} className="text-sky-500 text-xs font-medium">더보기</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {recentPosts.map(post => (
              <div
                key={post.id}
                className="relative rounded-xl overflow-hidden aspect-square cursor-pointer group"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <img src={post.image_url} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-[10px] line-clamp-2">{post.caption}</p>
                </div>
                <div className="absolute top-2 right-2 bg-black/40 rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                  <span className="text-white text-[9px]">♥ {post.likes_count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 카테고리 퀵 메뉴 */}
        <section className="px-4 py-3">
          <h2 className="font-bold text-slate-800 text-base mb-3">카테고리</h2>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '소파', emoji: '🛋️' },
              { label: '침대', emoji: '🛏️' },
              { label: '식탁', emoji: '🍽️' },
              { label: '책상', emoji: '💻' },
              { label: '옷장', emoji: '👔' },
              { label: '책장', emoji: '📚' },
              { label: 'TV장', emoji: '📺' },
              { label: '조명', emoji: '💡' },
            ].map(cat => (
              <button
                key={cat.label}
                onClick={() => navigate(`/posts?category=${cat.label}`)}
                className="flex flex-col items-center gap-1 py-3 bg-white rounded-2xl hover:bg-sky-50 hover:border-sky-200 border border-slate-100 transition-colors"
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-xs text-slate-600 font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <BottomTabNav />
    </div>
  )
}

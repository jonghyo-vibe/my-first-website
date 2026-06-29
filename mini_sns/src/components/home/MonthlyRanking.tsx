import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Furniture } from '../../types'

interface InteriorRankItem {
  id: string
  caption: string
  image_url: string
  likes_count: number
}

const RANK_COLORS = ['bg-yellow-400', 'bg-slate-400', 'bg-amber-600']

export default function MonthlyRanking() {
  const navigate = useNavigate()
  const [furniture, setFurniture] = useState<Furniture[]>([])
  const [interiorPosts, setInteriorPosts] = useState<InteriorRankItem[]>([])

  useEffect(() => {
    supabase.from('sns_furniture').select('*')
      .not('monthly_rank', 'is', null)
      .order('monthly_rank').limit(3)
      .then(({ data }) => { if (data) setFurniture(data as Furniture[]) })

    supabase.from('sns_posts').select('id,caption,image_url,likes_count')
      .order('likes_count', { ascending: false }).limit(3)
      .then(({ data }) => { if (data) setInteriorPosts(data) })
  }, [])

  const skeleton = (
    <>
      {[1, 2, 3].map(r => (
        <div key={r} className="flex items-center gap-2 py-1.5 animate-pulse">
          <div className="w-4 h-4 bg-slate-200 rounded-full flex-shrink-0" />
          <div className="w-8 h-8 bg-slate-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="h-2 bg-slate-200 rounded w-full" />
            <div className="h-2 bg-slate-100 rounded w-2/3" />
          </div>
        </div>
      ))}
    </>
  )

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 이달의 가구 순위 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-sky-50">
        <p className="text-[11px] font-bold text-sky-600 mb-2 flex items-center gap-1">
          <span>🏆</span> 이달의 가구
        </p>
        <div className="divide-y divide-slate-50">
          {furniture.length === 0 ? skeleton : furniture.map(f => (
            <button
              key={f.id}
              onClick={() => navigate(`/posts?category=${encodeURIComponent(f.category)}`)}
              className="flex items-center gap-2 py-1.5 w-full text-left active:bg-sky-50 transition-colors rounded-lg"
            >
              <span className={`${RANK_COLORS[f.monthly_rank! - 1] ?? 'bg-slate-300'} text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0`}>
                {f.monthly_rank}
              </span>
              <img src={f.image_url} alt={f.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-700 leading-tight line-clamp-1">{f.name}</p>
                <p className="text-[10px] text-sky-500 font-bold">{f.price.toLocaleString()}원</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 인테리어 순위 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-sky-50">
        <p className="text-[11px] font-bold text-sky-600 mb-2 flex items-center gap-1">
          <span>✨</span> 인테리어 순위
        </p>
        <div className="divide-y divide-slate-50">
          {interiorPosts.length === 0 ? skeleton : interiorPosts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => navigate(`/posts/${p.id}`)}
              className="flex items-center gap-2 py-1.5 w-full text-left active:bg-sky-50 transition-colors rounded-lg"
            >
              <span className={`${RANK_COLORS[i]} text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0`}>
                {i + 1}
              </span>
              <img src={p.image_url} alt="인테리어" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-700 leading-tight line-clamp-1">
                  {p.caption.slice(0, 12)}...
                </p>
                <p className="text-[10px] text-rose-400">♥ {p.likes_count}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

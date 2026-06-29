import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Furniture } from '../../types'

interface RankingItemProps {
  rank: number
  name: string
  price: number
  imageUrl: string
}

function RankItem({ rank, name, price, imageUrl }: RankingItemProps) {
  const rankColor = rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-slate-400' : 'bg-amber-600'
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className={`${rankColor} text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0`}>
        {rank}
      </span>
      <img src={imageUrl} alt={name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-700 leading-tight line-clamp-1">{name}</p>
        <p className="text-[10px] text-sky-500 font-bold">{price.toLocaleString()}원</p>
      </div>
    </div>
  )
}

export default function MonthlyRanking() {
  const [furniture, setFurniture] = useState<Furniture[]>([])
  const [interiorPosts, setInteriorPosts] = useState<{ caption: string; image_url: string; likes_count: number }[]>([])

  useEffect(() => {
    supabase.from('sns_furniture').select('*').not('monthly_rank', 'is', null)
      .order('monthly_rank').limit(3)
      .then(({ data }) => { if (data) setFurniture(data as Furniture[]) })

    supabase.from('sns_posts').select('caption,image_url,likes_count')
      .order('likes_count', { ascending: false }).limit(3)
      .then(({ data }) => { if (data) setInteriorPosts(data) })
  }, [])

  return (
    <div className="flex flex-col gap-4 w-[130px] flex-shrink-0">
      {/* 이달의 가구 순위 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-sky-50">
        <p className="text-[11px] font-bold text-sky-600 mb-2 flex items-center gap-1">
          <span>🏆</span> 이달의 가구
        </p>
        <div className="divide-y divide-slate-50">
          {furniture.map(f => (
            <RankItem
              key={f.id}
              rank={f.monthly_rank!}
              name={f.name}
              price={f.price}
              imageUrl={f.image_url}
            />
          ))}
          {furniture.length === 0 && (
            <>
              {[1,2,3].map(r => (
                <div key={r} className="flex items-center gap-2 py-1.5 animate-pulse">
                  <div className="w-4 h-4 bg-slate-200 rounded-full" />
                  <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-slate-200 rounded w-full" />
                    <div className="h-2 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 이달의 인테리어 순위 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-sky-50">
        <p className="text-[11px] font-bold text-sky-600 mb-2 flex items-center gap-1">
          <span>✨</span> 인테리어 순위
        </p>
        <div className="divide-y divide-slate-50">
          {interiorPosts.map((p, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5">
              <span className={`${['bg-yellow-400','bg-slate-400','bg-amber-600'][i]} text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0`}>
                {i + 1}
              </span>
              <img src={p.image_url} alt="인테리어" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-700 leading-tight line-clamp-1">
                  {p.caption.slice(0, 12)}...
                </p>
                <p className="text-[10px] text-rose-400">♥ {p.likes_count}</p>
              </div>
            </div>
          ))}
          {interiorPosts.length === 0 && (
            <>
              {[1,2,3].map(r => (
                <div key={r} className="flex items-center gap-2 py-1.5 animate-pulse">
                  <div className="w-4 h-4 bg-slate-200 rounded-full" />
                  <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-slate-200 rounded w-full" />
                    <div className="h-2 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

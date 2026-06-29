import { useState } from 'react'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import type { Furniture } from '../../types'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../store/authContext'

interface FurnitureCardProps {
  item: Furniture
  onLike?: () => void
  isLiked?: boolean
  showRank?: boolean
}

export default function FurnitureCard({ item, onLike, isLiked, showRank }: FurnitureCardProps) {
  const { currentUser } = useAuth()
  const [liked, setLiked] = useState(isLiked ?? false)
  const [addedCart, setAddedCart] = useState(false)
  const [showRecommend, setShowRecommend] = useState(false)

  const discountRate = item.original_price
    ? Math.round((1 - item.price / item.original_price) * 100)
    : 0

  async function handleLike(e: React.MouseEvent) {
    e.stopPropagation()
    if (!currentUser) return
    if (liked) {
      await supabase.from('sns_liked_furniture').delete()
        .eq('user_id', currentUser.id).eq('furniture_id', item.id)
    } else {
      await supabase.from('sns_liked_furniture').insert({ user_id: currentUser.id, furniture_id: item.id })
    }
    setLiked(!liked)
    onLike?.()
  }

  async function handleAddCart(e: React.MouseEvent) {
    e.stopPropagation()
    if (!currentUser) return
    await supabase.from('sns_cart')
      .upsert({ user_id: currentUser.id, furniture_id: item.id, quantity: 1 }, { onConflict: 'user_id,furniture_id' })
    setAddedCart(true)
    setTimeout(() => setAddedCart(false), 2000)
  }

  return (
    <>
      <div
        className="furniture-card relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowRecommend(true)}
      >
        {showRank && item.monthly_rank && (
          <span className="absolute top-2 left-2 z-10 w-6 h-6 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {item.monthly_rank}
          </span>
        )}
        {item.is_event && (
          <span className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
            특가
          </span>
        )}

        {/* 이미지 + hover 가격 */}
        <div className="relative overflow-hidden aspect-square">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {/* hover 시 가격 표시 */}
          <div className="price-tooltip absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
            <p className="text-white text-xs font-medium">{item.name}</p>
            <p className="text-sky-300 font-bold text-sm">{item.price.toLocaleString()}원</p>
          </div>
        </div>

        <div className="p-3">
          <p className="text-slate-500 text-[11px] mb-0.5">{item.category}</p>
          <p className="font-medium text-slate-800 text-sm leading-tight line-clamp-1">{item.name}</p>

          <div className="flex items-center gap-1 mt-1">
            {item.original_price && (
              <span className="text-rose-500 text-xs font-bold">{discountRate}%</span>
            )}
            <span className="font-bold text-slate-900 text-sm">{item.price.toLocaleString()}원</span>
            {item.original_price && (
              <span className="text-slate-400 text-xs line-through ml-1">
                {item.original_price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-slate-600 text-xs">{item.rating} ({item.review_count})</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleLike} className="touch-target flex items-center justify-center">
                <FiHeart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              </button>
              <button onClick={handleAddCart} className="touch-target flex items-center justify-center">
                <FiShoppingCart className={`w-4 h-4 ${addedCart ? 'text-sky-500' : 'text-slate-400'}`} />
              </button>
            </div>
          </div>
          {addedCart && (
            <p className="text-sky-500 text-[10px] text-right mt-1">장바구니에 추가됨!</p>
          )}
        </div>
      </div>

      {/* 클릭 시 추천 가구 모달 */}
      {showRecommend && (
        <RecommendModal item={item} onClose={() => setShowRecommend(false)} />
      )}
    </>
  )
}

function RecommendModal({ item, onClose }: { item: Furniture; onClose: () => void }) {
  const [related, setRelated] = useState<Furniture[]>([])

  useState(() => {
    supabase.from('sns_furniture')
      .select('*')
      .eq('category', item.category)
      .neq('id', item.id)
      .limit(4)
      .then(({ data }) => { if (data) setRelated(data) })
  })

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] mx-auto bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
        <h3 className="font-bold text-slate-800 mb-1">{item.name}</h3>
        <p className="text-sky-500 font-bold text-lg mb-2">{item.price.toLocaleString()}원</p>
        <p className="text-slate-500 text-sm mb-4">{item.description}</p>

        {related.length > 0 && (
          <>
            <p className="font-semibold text-slate-700 mb-3">함께 보면 좋은 가구</p>
            <div className="grid grid-cols-2 gap-3">
              {related.map(r => (
                <div key={r.id} className="bg-slate-50 rounded-xl overflow-hidden">
                  <img src={r.image_url} alt={r.name} className="w-full aspect-square object-cover" />
                  <div className="p-2">
                    <p className="text-xs font-medium text-slate-700 line-clamp-1">{r.name}</p>
                    <p className="text-xs text-sky-600 font-bold">{r.price.toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

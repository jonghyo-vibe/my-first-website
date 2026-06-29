import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import BottomTabNav from '../components/layout/BottomTabNav'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { supabase } from '../lib/supabase'
import { useAuth } from '../store/authContext'
import type { CartItem, Order, LikedFurniture, SnsPost, Furniture } from '../types'
import { ORDER_STATUS_LABELS } from '../types'
import { FiShoppingCart, FiHeart, FiPackage, FiLogOut, FiCamera, FiStar } from 'react-icons/fi'

type MyTab = 'shopping' | 'liked' | 'posts' | 'recommend'

export default function MyPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [tab, setTab] = useState<MyTab>('shopping')
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [liked, setLiked] = useState<LikedFurniture[]>([])
  const [myPosts, setMyPosts] = useState<SnsPost[]>([])
  const [recommended, setRecommended] = useState<Furniture[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentUser) return
    setLoading(true)
    const id = currentUser.id

    Promise.all([
      supabase.from('sns_cart').select('*, sns_furniture(*)').eq('user_id', id),
      supabase.from('sns_orders').select('*').eq('user_id', id).order('created_at', { ascending: false }),
      supabase.from('sns_liked_furniture').select('*, sns_furniture(*)').eq('user_id', id),
      supabase.from('sns_posts').select('*').eq('user_id', id).order('created_at', { ascending: false }),
    ]).then(([cartRes, orderRes, likedRes, postsRes]) => {
      setCart(cartRes.data ?? [])
      setOrders(orderRes.data ?? [])
      setLiked(likedRes.data ?? [])
      setMyPosts(postsRes.data ?? [])
      setLoading(false)
    })
  }, [currentUser])

  useEffect(() => {
    if (tab === 'recommend' && cart.length > 0) {
      const cartFurniture = cart[0].sns_furniture
      if (cartFurniture) {
        supabase.from('sns_furniture').select('*')
          .eq('category', cartFurniture.category)
          .neq('id', cartFurniture.id)
          .limit(4)
          .then(({ data }) => { if (data) setRecommended(data as Furniture[]) })
      } else {
        supabase.from('sns_furniture').select('*').not('monthly_rank', 'is', null).limit(4)
          .then(({ data }) => { if (data) setRecommended(data as Furniture[]) })
      }
    }
  }, [tab, cart])

  async function handleRemoveCart(cartId: number) {
    await supabase.from('sns_cart').delete().eq('id', cartId)
    setCart(p => p.filter(c => c.id !== cartId))
  }

  async function handleOrder(item: CartItem) {
    if (!currentUser || !item.sns_furniture) return
    const f = item.sns_furniture
    await supabase.from('sns_orders').insert({
      user_id: currentUser.id,
      furniture_id: f.id,
      furniture_name: f.name,
      furniture_image: f.image_url,
      furniture_price: f.price,
      quantity: item.quantity,
    })
    await supabase.from('sns_cart').delete().eq('id', item.id)
    setCart(p => p.filter(c => c.id !== item.id))
    const { data } = await supabase.from('sns_orders').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
    setOrders(data ?? [])
    setTab('shopping')
    alert('주문이 완료되었습니다!')
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="마이페이지" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-5xl">👤</p>
          <p className="font-bold text-slate-700 text-lg">로그인이 필요합니다</p>
          <p className="text-slate-500 text-sm text-center">로그인하고 장바구니, 주문내역, 좋아요 기능을 사용해보세요</p>
          <button onClick={() => navigate('/login')} className="w-full max-w-xs py-4 bg-sky-500 text-white font-bold rounded-2xl">
            로그인 / 회원가입
          </button>
        </div>
        <BottomTabNav />
      </div>
    )
  }

  const myTabs: { key: MyTab; label: string; icon: typeof FiShoppingCart }[] = [
    { key: 'shopping', label: '나의 쇼핑', icon: FiPackage },
    { key: 'liked', label: '좋아요', icon: FiHeart },
    { key: 'posts', label: '내 게시물', icon: FiCamera },
    { key: 'recommend', label: '추천', icon: FiStar },
  ]

  const orderStatusColor: Record<Order['status'], string> = {
    ordered: 'bg-slate-100 text-slate-600',
    confirmed: 'bg-yellow-100 text-yellow-700',
    shipping: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="마이페이지" />

      <main className="flex-1 page-content">
        {/* 프로필 */}
        <div className="bg-white px-6 pt-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`}
                alt="profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-sky-200"
              />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-slate-800 text-lg">{currentUser.display_name}</h2>
              <p className="text-slate-500 text-sm">{currentUser.email}</p>
              {currentUser.bio && <p className="text-slate-600 text-xs mt-0.5">{currentUser.bio}</p>}
            </div>
            <button onClick={async () => { await logout(); navigate('/') }} className="flex items-center gap-1 text-slate-400 text-xs">
              <FiLogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 rounded-2xl p-3">
            <div className="text-center">
              <p className="font-bold text-slate-800 text-lg">{myPosts.length}</p>
              <p className="text-slate-500 text-xs">게시물</p>
            </div>
            <div className="text-center border-x border-slate-200">
              <p className="font-bold text-slate-800 text-lg">{liked.length}</p>
              <p className="text-slate-500 text-xs">좋아요</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-lg">{orders.length}</p>
              <p className="text-slate-500 text-xs">주문</p>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="bg-white border-b border-slate-100 flex overflow-x-auto">
          {myTabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 min-w-[60px] text-xs font-medium border-b-2 transition-colors ${
                tab === key ? 'text-sky-500 border-sky-500' : 'text-slate-400 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="px-4 py-4">
          {loading ? <LoadingSpinner /> : (
            <>
              {/* 나의 쇼핑 탭 */}
              {tab === 'shopping' && (
                <div className="space-y-4">
                  {/* 장바구니 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FiShoppingCart className="w-4 h-4 text-sky-500" />
                      <h3 className="font-bold text-slate-800">장바구니 ({cart.length})</h3>
                    </div>
                    {cart.length === 0 ? (
                      <div className="bg-white rounded-2xl p-6 text-center text-slate-400">
                        <p className="text-3xl mb-2">🛒</p>
                        <p className="text-sm">장바구니가 비어있어요</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {cart.map(c => c.sns_furniture && (
                          <div key={c.id} className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm">
                            <img src={c.sns_furniture.image_url} alt={c.sns_furniture.name} className="w-16 h-16 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 text-sm line-clamp-1">{c.sns_furniture.name}</p>
                              <p className="text-sky-600 font-bold text-sm">{c.sns_furniture.price.toLocaleString()}원</p>
                              <p className="text-slate-400 text-xs">수량: {c.quantity}개</p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <button onClick={() => handleOrder(c)} className="px-3 py-1.5 bg-sky-500 text-white text-xs font-medium rounded-lg">주문</button>
                              <button onClick={() => handleRemoveCart(c.id)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">삭제</button>
                            </div>
                          </div>
                        ))}
                        {cart.length > 0 && (
                          <div className="bg-sky-50 rounded-2xl p-3 flex items-center justify-between">
                            <span className="text-slate-600 text-sm font-medium">총 금액</span>
                            <span className="text-sky-600 font-bold">
                              {cart.reduce((sum, c) => sum + (c.sns_furniture?.price ?? 0) * c.quantity, 0).toLocaleString()}원
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 주문/배송 현황 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FiPackage className="w-4 h-4 text-sky-500" />
                      <h3 className="font-bold text-slate-800">주문/배송 현황 ({orders.length})</h3>
                    </div>
                    {orders.length === 0 ? (
                      <div className="bg-white rounded-2xl p-6 text-center text-slate-400">
                        <p className="text-3xl mb-2">📦</p>
                        <p className="text-sm">주문 내역이 없어요</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {orders.map(o => (
                          <div key={o.id} className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm">
                            <img src={o.furniture_image} alt={o.furniture_name} className="w-14 h-14 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 text-sm line-clamp-1">{o.furniture_name}</p>
                              <p className="text-slate-500 text-xs">{o.furniture_price.toLocaleString()}원 × {o.quantity}</p>
                              <p className="text-slate-400 text-[10px] mt-0.5">{new Date(o.created_at).toLocaleDateString('ko-KR')}</p>
                            </div>
                            <span className={`self-start px-2 py-1 rounded-full text-[10px] font-bold ${orderStatusColor[o.status]}`}>
                              {ORDER_STATUS_LABELS[o.status]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 좋아요 탭 */}
              {tab === 'liked' && (
                <div>
                  {liked.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-4xl mb-3">🤍</p>
                      <p className="font-medium">좋아요한 가구가 없어요</p>
                      <button onClick={() => navigate('/posts')} className="mt-3 text-sky-500 text-sm">가구 둘러보기</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {liked.map(l => l.sns_furniture && (
                        <div key={l.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                          <img src={l.sns_furniture.image_url} alt={l.sns_furniture.name} className="w-full aspect-square object-cover" />
                          <div className="p-2.5">
                            <p className="text-slate-800 text-xs font-medium line-clamp-1">{l.sns_furniture.name}</p>
                            <p className="text-sky-600 text-xs font-bold mt-0.5">{l.sns_furniture.price.toLocaleString()}원</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 내 게시물 탭 */}
              {tab === 'posts' && (
                <div>
                  {myPosts.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-4xl mb-3">📷</p>
                      <p className="font-medium">아직 게시물이 없어요</p>
                      <button onClick={() => navigate('/posts/create')} className="mt-3 text-sky-500 text-sm">첫 게시물 올리기</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-1.5">
                      {myPosts.map(p => (
                        <div
                          key={p.id}
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                          onClick={() => navigate(`/posts/${p.id}`)}
                        >
                          <img src={p.image_url} alt={p.caption} className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 right-1 bg-black/50 rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                            <span className="text-white text-[9px]">♥ {p.likes_count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 추천 탭 */}
              {tab === 'recommend' && (
                <div>
                  <p className="text-slate-500 text-sm mb-4">
                    {cart.length > 0
                      ? `장바구니의 "${cart[0].sns_furniture?.name}"과 함께 많이 구매한 가구`
                      : '이달의 인기 가구 추천'}
                  </p>
                  {recommended.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-4xl mb-3">🌟</p>
                      <p className="font-medium">추천 가구를 불러오는 중...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {recommended.map(f => (
                        <div key={f.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                          <img src={f.image_url} alt={f.name} className="w-full aspect-square object-cover" />
                          <div className="p-3">
                            <p className="text-slate-500 text-[11px]">{f.category}</p>
                            <p className="font-medium text-slate-800 text-sm line-clamp-1">{f.name}</p>
                            <p className="text-sky-600 font-bold text-sm mt-1">{f.price.toLocaleString()}원</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-yellow-400 text-xs">★</span>
                              <span className="text-slate-500 text-xs">{f.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <BottomTabNav />
    </div>
  )
}

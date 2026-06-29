import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import BottomTabNav from '../components/layout/BottomTabNav'
import { supabase } from '../lib/supabase'
import { useAuth } from '../store/authContext'
import { fetchRandomInteriorPhotos, type UnsplashPhoto } from '../lib/unsplash'
import type { RoomSize } from '../types'
import { ROOM_SIZE_LABELS } from '../types'
import { FiRefreshCw } from 'react-icons/fi'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function PostCreatePage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [caption, setCaption] = useState('')
  const [roomSize, setRoomSize] = useState<RoomSize>('medium')
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header showBack title="게시물 작성" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-4xl">🔐</p>
          <p className="font-semibold text-slate-700">로그인이 필요합니다</p>
          <button onClick={() => navigate('/login')} className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-xl">
            로그인하러 가기
          </button>
        </div>
        <BottomTabNav />
      </div>
    )
  }

  async function loadPhotos() {
    setLoadingPhotos(true)
    const result = await fetchRandomInteriorPhotos(9)
    setPhotos(result)
    setLoadingPhotos(false)
  }

  async function handleSubmit() {
    if (!selectedPhoto || !caption.trim() || !currentUser) return
    setSubmitting(true)
    await supabase.from('sns_posts').insert({
      user_id: currentUser.id,
      caption: caption.trim(),
      image_url: selectedPhoto.urls.regular,
      room_size: roomSize,
    })
    setSubmitting(false)
    navigate('/posts')
  }

  const roomSizes = Object.entries(ROOM_SIZE_LABELS) as [RoomSize, string][]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header showBack title={step === 1 ? '글 작성' : '이미지 선택'} showActions={false} />

      <main className="flex-1 page-content px-4">
        {/* 진행 상태 */}
        <div className="flex items-center gap-2 py-4">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-indigo-500' : 'bg-violet-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-indigo-500' : 'bg-violet-200'}`} />
        </div>

        {step === 1 ? (
          /* 1단계: 내용 입력 */
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">집 규격</label>
              <div className="flex flex-wrap gap-2">
                {roomSizes.map(([size, label]) => (
                  <button
                    key={size}
                    onClick={() => setRoomSize(size)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      roomSize === size
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-white text-slate-600 border-violet-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                내용 <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="인테리어 이야기를 공유해보세요! 어떤 가구를 사용했는지, 어떤 느낌을 원했는지 등..."
                rows={5}
                className="w-full p-4 border border-violet-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
              />
              <p className="text-slate-400 text-xs text-right mt-1">{caption.length} / 500</p>
            </div>

            <button
              onClick={() => { setStep(2); loadPhotos() }}
              disabled={!caption.trim()}
              className="w-full py-4 bg-indigo-500 text-white font-bold rounded-2xl disabled:opacity-40 hover:bg-indigo-600 transition-colors"
            >
              다음: 이미지 선택
            </button>
          </div>
        ) : (
          /* 2단계: Unsplash 이미지 선택 */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">마음에 드는 이미지를 선택하세요</p>
              <button
                onClick={loadPhotos}
                disabled={loadingPhotos}
                className="flex items-center gap-1.5 text-xs text-indigo-500 font-medium"
              >
                <FiRefreshCw className={`w-3.5 h-3.5 ${loadingPhotos ? 'animate-spin' : ''}`} />
                새로고침
              </button>
            </div>

            {loadingPhotos ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {photos.map(photo => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedPhoto?.id === photo.id
                        ? 'border-indigo-500 scale-95'
                        : 'border-transparent'
                    }`}
                  >
                    <img src={photo.urls.small} alt={photo.alt_description} className="w-full h-full object-cover" />
                    {selectedPhoto?.id === photo.id && (
                      <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                        <span className="text-white text-2xl">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {selectedPhoto && (
              <div className="bg-indigo-50 rounded-2xl p-3 flex gap-3 items-center">
                <img src={selectedPhoto.urls.thumb} alt="선택됨" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="text-xs text-slate-500">선택된 이미지</p>
                  <p className="text-sm font-medium text-slate-700">by {selectedPhoto.user.name}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-violet-100 text-slate-700 font-semibold rounded-2xl hover:bg-violet-200 transition-colors"
              >
                이전
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedPhoto || submitting}
                className="flex-1 py-4 bg-indigo-500 text-white font-bold rounded-2xl disabled:opacity-40 hover:bg-indigo-600 transition-colors"
              >
                {submitting ? '올리는 중...' : '게시물 올리기'}
              </button>
            </div>
          </div>
        )}
      </main>
      <BottomTabNav />
    </div>
  )
}

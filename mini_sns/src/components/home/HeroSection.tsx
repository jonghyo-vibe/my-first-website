import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const heroImages = [
  { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=540&fit=crop&auto=format', label: '모던 리빙룸' },
  { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=540&fit=crop&auto=format', label: '미니멀 침실' },
  { url: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=800&h=540&fit=crop&auto=format', label: '북유럽 주방' },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % heroImages.length), 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
      {heroImages.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white/70 text-xs mb-1">오늘의 추천</p>
        <h2 className="text-white font-bold text-xl leading-tight mb-4 drop-shadow">
          {heroImages[current].label}
        </h2>
        <button
          onClick={() => navigate('/posts')}
          className="px-5 py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-full hover:bg-indigo-600 transition-colors shadow-lg"
        >
          인테리어 구경하기
        </button>
      </div>

      {/* 슬라이드 인디케이터 */}
      <div className="absolute bottom-5 right-5 flex gap-1.5">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  )
}

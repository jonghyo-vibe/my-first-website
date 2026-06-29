import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const heroImages = [
  { url: 'https://picsum.photos/seed/hero1/600/400', label: '모던 리빙룸' },
  { url: 'https://picsum.photos/seed/hero2/600/400', label: '미니멀 침실' },
  { url: 'https://picsum.photos/seed/hero3/600/400', label: '북유럽 주방' },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % heroImages.length), 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex-1 min-w-0">
      <div className="relative rounded-2xl overflow-hidden shadow-sm">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
          </div>
        ))}
        {/* 기본 표시용 */}
        <img
          src={heroImages[0].url}
          alt={heroImages[0].label}
          className="w-full aspect-[4/3] object-cover opacity-0"
        />

        {/* 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white/70 text-xs mb-1">오늘의 추천</p>
          <h2 className="text-white font-bold text-base leading-tight mb-3">
            {heroImages[current].label}
          </h2>
          <button
            onClick={() => navigate('/posts')}
            className="px-4 py-2 bg-sky-500 text-white text-xs font-semibold rounded-full hover:bg-sky-600 transition-colors"
          >
            인테리어 구경하기
          </button>
        </div>

        {/* 인디케이터 */}
        <div className="absolute top-3 right-3 flex gap-1">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

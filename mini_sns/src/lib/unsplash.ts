const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string

export interface UnsplashPhoto {
  id: string
  urls: {
    regular: string
    small: string
    thumb: string
  }
  alt_description: string
  user: {
    name: string
  }
}

export async function fetchRandomInteriorPhotos(count = 9): Promise<UnsplashPhoto[]> {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'demo') {
    return generatePlaceholderPhotos(count)
  }
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=interior+furniture+korean&count=${count}&orientation=squarish`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    )
    if (!res.ok) return generatePlaceholderPhotos(count)
    return res.json()
  } catch {
    return generatePlaceholderPhotos(count)
  }
}

// 검증된 Unsplash 인테리어/가구 이미지 ID 목록
const INTERIOR_PHOTO_IDS = [
  '1598928506311-c55ded91a20c', // 럭셔리 리빙룸
  '1505693416388-ac5ce068fe85', // 모던 침실
  '1518455027359-f3f8164ba6bd', // 홈오피스
  '1586023492125-27b2c045efd7', // 노란 암체어 거실
  '1555041469-a586c61ea9bc',   // 녹색 소파
  '1524484485831-a92ffc0de03f', // 펜던트 조명
  '1600566752229-250ed79470f8', // 미니멀 주방
  '1567538096630-e0c55bd6374c', // 흰 암체어
  '1484101403633-562f891dc89a', // 회색 소파
  '1533090161767-e6ffed986c88', // 미니멀 데스크
  '1598928506311-c55ded91a20c', // 럭셔리 거실 2
  '1505693416388-ac5ce068fe85', // 침실 2
]

function generatePlaceholderPhotos(count: number): UnsplashPhoto[] {
  return Array.from({ length: count }, (_, i) => {
    const photoId = INTERIOR_PHOTO_IDS[i % INTERIOR_PHOTO_IDS.length]
    const base = `https://images.unsplash.com/photo-${photoId}`
    return {
      id: `unsplash-${photoId}`,
      urls: {
        regular: `${base}?w=600&h=600&fit=crop&auto=format`,
        small:   `${base}?w=300&h=300&fit=crop&auto=format`,
        thumb:   `${base}?w=150&h=150&fit=crop&auto=format`,
      },
      alt_description: `인테리어 이미지 ${i + 1}`,
      user: { name: 'Unsplash' },
    }
  })
}

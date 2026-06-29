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

function generatePlaceholderPhotos(count: number): UnsplashPhoto[] {
  const seeds = ['interior1','interior2','interior3','interior4','interior5',
                 'room1','room2','room3','room4','living1','bedroom1','kitchen1']
  return Array.from({ length: count }, (_, i) => ({
    id: `placeholder-${i}`,
    urls: {
      regular: `https://picsum.photos/seed/${seeds[i % seeds.length]}/600/600`,
      small: `https://picsum.photos/seed/${seeds[i % seeds.length]}/300/300`,
      thumb: `https://picsum.photos/seed/${seeds[i % seeds.length]}/150/150`,
    },
    alt_description: `인테리어 이미지 ${i + 1}`,
    user: { name: '뷰테리어' },
  }))
}

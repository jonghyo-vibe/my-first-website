export interface SnsUser {
  id: string
  email: string
  display_name: string
  bio: string
  avatar_url: string
  created_at: string
}

export interface SnsPost {
  id: number
  user_id: string
  caption: string
  image_url: string
  room_size: 'studio' | 'small' | 'medium' | 'large' | 'penthouse'
  likes_count: number
  created_at: string
  sns_users?: SnsUser
  is_liked?: boolean
}

export interface SnsComment {
  id: number
  post_id: number
  user_id: string
  content: string
  created_at: string
  sns_users?: SnsUser
}

export interface Furniture {
  id: number
  name: string
  category: string
  price: number
  original_price?: number
  image_url: string
  description: string
  room_size_fit: string
  monthly_rank?: number
  is_event: boolean
  rating: number
  review_count: number
  created_at: string
}

export interface CartItem {
  id: number
  user_id: string
  furniture_id: number
  quantity: number
  created_at: string
  sns_furniture?: Furniture
}

export interface Order {
  id: number
  user_id: string
  furniture_id?: number
  furniture_name: string
  furniture_image: string
  furniture_price: number
  quantity: number
  status: 'ordered' | 'confirmed' | 'shipping' | 'delivered'
  tracking_number?: string
  created_at: string
}

export interface LikedFurniture {
  id: number
  user_id: string
  furniture_id: number
  created_at: string
  sns_furniture?: Furniture
}

export type RoomSize = 'all' | 'studio' | 'small' | 'medium' | 'large' | 'penthouse'

export const ROOM_SIZE_LABELS: Record<RoomSize, string> = {
  all: '전체',
  studio: '원룸/스튜디오',
  small: '1~2인 소형',
  medium: '2~3인 중형',
  large: '3~4인 대형',
  penthouse: '펜트하우스',
}

export const ORDER_STATUS_LABELS: Record<Order['status'], string> = {
  ordered: '주문완료',
  confirmed: '배송준비',
  shipping: '배송중',
  delivered: '배송완료',
}

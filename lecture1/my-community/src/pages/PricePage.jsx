import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CATEGORY_EMOJI = { '목욕': '🛁', '미용': '✂️', '관리': '💅', '패키지': '🎁' }

export default function PricePage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [activeTab, setActiveTab] = useState('전체')

  useEffect(() => {
    supabase.from('price_list').select('*').order('sort_order').then(({ data }) => setItems(data || []))
  }, [])

  const categories = ['전체', ...new Set(items.map((i) => i.category))]
  const filtered = activeTab === '전체' ? items : items.filter((i) => i.category === activeTab)

  return (
    <div style={s.wrap}>
      <div style={s.hero}>
        <p style={{ fontSize: 40, marginBottom: 8 }}>💰</p>
        <h1 style={s.heroTitle}>가격표</h1>
        <p style={s.heroSub}>합리적인 가격으로 예쁘게 만들어 드려요 🐾</p>
      </div>

      <div style={s.container}>
        <div style={s.notice}>
          <p>🐶 소형 (5kg 이하) &nbsp;|&nbsp; 🐕 중형 (5~15kg) &nbsp;|&nbsp; 🐻 대형 (15kg 이상)</p>
          <p style={{ marginTop: 4, fontSize: 12 }}>* 견종과 털 상태에 따라 가격이 변동될 수 있습니다.</p>
        </div>

        {/* 카테고리 탭 */}
        <div style={s.tabs}>
          {categories.map((cat) => (
            <button key={cat} className={`btn ${activeTab === cat ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 13 }} onClick={() => setActiveTab(cat)}>
              {CATEGORY_EMOJI[cat] || ''} {cat}
            </button>
          ))}
        </div>

        {/* 가격 테이블 */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>서비스</th>
                <th style={s.th}>설명</th>
                <th style={{ ...s.th, textAlign: 'center' }}>🐶 소형</th>
                <th style={{ ...s.th, textAlign: 'center' }}>🐕 중형</th>
                <th style={{ ...s.th, textAlign: 'center' }}>🐻 대형</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--primary-soft)' }}>
                  <td style={s.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={s.catBadge}>{CATEGORY_EMOJI[item.category] || ''} {item.category}</span>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{ ...s.td, color: 'var(--text-muted)', fontSize: 13 }}>{item.description}</td>
                  <td style={{ ...s.td, textAlign: 'center', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    {item.small_price ? `${item.small_price.toLocaleString()}원` : '-'}
                  </td>
                  <td style={{ ...s.td, textAlign: 'center', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    {item.medium_price ? `${item.medium_price.toLocaleString()}원` : '-'}
                  </td>
                  <td style={{ ...s.td, textAlign: 'center', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    {item.large_price ? `${item.large_price.toLocaleString()}원` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn btn-primary" style={{ marginTop: 28, width: '100%' }} onClick={() => navigate('/reservation')}>
          📅 지금 예약하기
        </button>
      </div>
    </div>
  )
}

const s = {
  wrap: { minHeight: '100vh' },
  hero: { background: 'linear-gradient(145deg, #e1d5f7 0%, #c9b8f0 100%)', padding: '52px 20px 40px', textAlign: 'center' },
  heroTitle: { fontSize: 34, fontWeight: 900, color: '#fff', marginBottom: 8, textShadow: '0 2px 8px rgba(0,0,0,0.12)' },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 15 },
  container: { maxWidth: 860, margin: '0 auto', padding: '32px 20px 48px' },
  notice: { background: 'var(--primary-soft)', border: '1.5px solid var(--primary-light)', borderRadius: 14, padding: '14px 18px', marginBottom: 24, fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' },
  tabs: { display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: 'linear-gradient(135deg, var(--primary-light), var(--primary-soft))' },
  th: { padding: '14px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary-dark)', textAlign: 'left', borderBottom: '2px solid var(--border)' },
  td: { padding: '13px 16px', fontSize: 14, color: 'var(--text)', borderBottom: '1px solid var(--border)' },
  catBadge: { fontSize: 11, background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: 50, fontWeight: 700, whiteSpace: 'nowrap' },
}

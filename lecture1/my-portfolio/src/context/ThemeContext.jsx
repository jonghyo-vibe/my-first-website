import { createContext, useContext, useEffect, useState } from 'react'

const ThemeCtx = createContext({ isDark: true, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // 초기값: localStorage > OS 설정 순서로 결정
    try {
      const stored = localStorage.getItem('portfolio-theme')
      if (stored) return stored === 'dark'
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // data-theme 속성 + localStorage 동기화
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    try { localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light') } catch {}
  }, [isDark])

  // OS 테마 변경 감지 (사용자가 수동 설정하지 않은 경우만)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const fn = (e) => {
      try {
        if (!localStorage.getItem('portfolio-theme')) setIsDark(e.matches)
      } catch {}
    }
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  return (
    <ThemeCtx.Provider value={{ isDark, toggle: () => setIsDark(p => !p) }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)

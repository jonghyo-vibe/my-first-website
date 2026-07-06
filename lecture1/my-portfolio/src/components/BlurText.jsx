import { motion } from 'motion/react'
import { useEffect, useRef, useState, useMemo } from 'react'

export default function BlurText({
  text = '',
  delay = 80,
  animateBy = 'words',
  direction = 'bottom',
  threshold = 0.15,
  className = '',
  style = {},
}) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  const from = useMemo(() => ({
    filter: 'blur(10px)',
    opacity: 0,
    y: direction === 'top' ? -30 : 30,
  }), [direction])

  return (
    <span ref={ref} style={{ display: 'flex', flexWrap: 'wrap', ...style }}>
      {elements.map((word, i) => (
        <motion.span
          key={i}
          initial={from}
          animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : from}
          transition={{ duration: 0.5, delay: i * delay / 1000, ease: 'easeOut' }}
          style={{ display: 'inline-block', marginRight: animateBy === 'words' ? '0.25em' : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

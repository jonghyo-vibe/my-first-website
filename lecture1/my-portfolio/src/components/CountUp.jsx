import { useInView, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'

export default function CountUp({
  to,
  from = 0,
  duration = 1.8,
  delay = 0,
  className = '',
  style = {},
}) {
  const ref = useRef(null)
  const motionValue = useMotionValue(from)
  const damping = 20 + 40 * (1 / duration)
  const stiffness = 100 * (1 / duration)
  const springValue = useSpring(motionValue, { damping, stiffness })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  useEffect(() => {
    if (ref.current) ref.current.textContent = String(from)
  }, [from])

  useEffect(() => {
    if (!isInView) return
    const id = setTimeout(() => motionValue.set(to), delay * 1000)
    return () => clearTimeout(id)
  }, [isInView, motionValue, to, delay])

  useEffect(() => {
    return springValue.on('change', v => {
      if (ref.current) ref.current.textContent = Math.round(v)
    })
  }, [springValue])

  return <span ref={ref} className={className} style={style} />
}

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const RotatingText = forwardRef(({
  texts,
  transition = { type: 'spring', damping: 25, stiffness: 300 },
  initial = { y: '100%', opacity: 0 },
  animate = { y: 0, opacity: 1 },
  exit = { y: '-120%', opacity: 0 },
  rotationInterval = 2200,
  staggerDuration = 0.03,
  staggerFrom = 'first',
  loop = true,
  auto = true,
  splitBy = 'characters',
  onNext,
  style = {},
  ...rest
}, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const splitIntoChars = text => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text), s => s.segment)
    }
    return Array.from(text)
  }

  const elements = useMemo(() => {
    const current = texts[currentIndex]
    if (splitBy === 'characters') {
      return current.split(' ').map((word, i, arr) => ({
        characters: splitIntoChars(word),
        needsSpace: i !== arr.length - 1,
      }))
    }
    return current.split(' ').map((word, i, arr) => ({
      characters: [word],
      needsSpace: i !== arr.length - 1,
    }))
  }, [texts, currentIndex, splitBy])

  const getDelay = useCallback((index, total) => {
    if (staggerFrom === 'first') return index * staggerDuration
    if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration
    return Math.abs(Math.floor(total / 2) - index) * staggerDuration
  }, [staggerFrom, staggerDuration])

  const next = useCallback(() => {
    setCurrentIndex(i => {
      const next = i === texts.length - 1 ? (loop ? 0 : i) : i + 1
      if (onNext) onNext(next)
      return next
    })
  }, [texts.length, loop, onNext])

  useImperativeHandle(ref, () => ({
    next,
    previous: () => setCurrentIndex(i => i === 0 ? (loop ? texts.length - 1 : 0) : i - 1),
    jumpTo: idx => setCurrentIndex(Math.max(0, Math.min(idx, texts.length - 1))),
    reset: () => setCurrentIndex(0),
  }), [next, texts.length, loop])

  useEffect(() => {
    if (!auto) return
    const id = setInterval(next, rotationInterval)
    return () => clearInterval(id)
  }, [next, rotationInterval, auto])

  const totalChars = elements.reduce((s, w) => s + w.characters.length, 0)

  return (
    <motion.span
      layout
      transition={transition}
      style={{ display: 'inline-flex', overflow: 'hidden', verticalAlign: 'bottom', ...style }}
      {...rest}
    >
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {texts[currentIndex]}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={currentIndex} style={{ display: 'inline-flex' }} aria-hidden>
          {elements.map((wordObj, wi, arr) => {
            const prev = arr.slice(0, wi).reduce((s, w) => s + w.characters.length, 0)
            return (
              <span key={wi} style={{ display: 'inline-flex' }}>
                {wordObj.characters.map((char, ci) => (
                  <motion.span
                    key={ci}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{ ...transition, delay: getDelay(prev + ci, totalChars) }}
                    style={{ display: 'inline-block', willChange: 'transform, opacity' }}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
              </span>
            )
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
})

RotatingText.displayName = 'RotatingText'
export default RotatingText

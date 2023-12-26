import { useEffect, useRef } from 'react'

export const useHorizontalScroll = () => {
  const elRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = elRef.current
    if (!el) {
      return
    }
    const handleWheelEvent = (e: any) => {
      if (e.deltaY === 0) {
        return
      }
      e.preventDefault()
      el.scrollTo({
        behavior: 'smooth',
        left: el.scrollLeft + e.deltaY
      })
    }
    el.addEventListener('wheel', handleWheelEvent)
    return () => el.removeEventListener('wheel', handleWheelEvent)
  }, [])
  return elRef
}

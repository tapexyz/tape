import { useEffect, useRef } from 'react'

const useHorizontalScroll = () => {
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
        left: el.scrollLeft + e.deltaY,
        behavior: 'smooth'
      })
    }
    el.addEventListener('wheel', handleWheelEvent)
    return () => el.removeEventListener('wheel', handleWheelEvent)
  }, [])
  return elRef
}

export default useHorizontalScroll

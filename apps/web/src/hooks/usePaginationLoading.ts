import { useEffect, useState } from 'react'

type Props<T> = {
  ref: React.RefObject<HTMLDivElement>
  fetch: () => Promise<T>
}

export const usePaginationLoading = <T>({ ref, fetch }: Props<T>) => {
  const [latestHeight, setLatestHeight] = useState<number>(0)

  const handleScroll = async () => {
    if (
      ref.current &&
      latestHeight <= window.scrollY &&
      latestHeight !== ref.current.offsetHeight
    ) {
      setLatestHeight(ref.current.offsetHeight)
      await fetch()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })
}

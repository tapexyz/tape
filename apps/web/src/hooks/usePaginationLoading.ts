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
      latestHeight <= ref.current.clientHeight &&
      latestHeight !== ref.current.scrollHeight
    ) {
      setLatestHeight(ref.current.scrollHeight)
      await fetch()
    }
  }

  useEffect(() => {
    const current = ref.current
    current?.addEventListener('mousewheel', handleScroll)
    return () => {
      current?.removeEventListener('mousewheel', handleScroll)
    }
  })
}

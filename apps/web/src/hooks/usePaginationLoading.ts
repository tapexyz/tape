import { useEffect, useState } from 'react'

type Props<T> = {
  ref: React.RefObject<HTMLDivElement>
  fetch: () => Promise<T>
}

export const usePaginationLoading = <T>({ ref, fetch }: Props<T>) => {
  const [latestHeight, setLatestHeight] = useState<number>(0)
  const [pageLoading, setPageLoading] = useState<boolean>(false)

  const handleScroll = async () => {
    if (
      ref.current &&
      latestHeight <= ref.current.clientHeight &&
      latestHeight !== ref.current.scrollHeight
    ) {
      setPageLoading(true)
      setLatestHeight(ref.current.scrollHeight)
      await fetch()
    }
  }

  useEffect(() => {
    const current = ref.current
    current?.addEventListener('scroll', handleScroll)
    return () => {
      current?.removeEventListener('scroll', handleScroll)
    }
  })

  return { pageLoading }
}

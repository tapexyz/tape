import { useEffect, useState } from 'react'

type Props<T> = {
  ref: React.RefObject<HTMLDivElement>
  hasMore: boolean
  fetch: () => Promise<T>
}

export const usePaginationLoading = <T>({ ref, hasMore, fetch }: Props<T>) => {
  const [pageLoading, setPageLoading] = useState<boolean>(false)

  const handleScroll = async () => {
    const scrollThreshold = 0.5 // Determines when to start fetching, based on the percentage of the scroll position

    if (
      !pageLoading &&
      hasMore &&
      ref.current &&
      window.innerHeight + window.scrollY >=
        ref.current.offsetTop + ref.current.clientHeight * scrollThreshold
    ) {
      setPageLoading(true)
      await fetch()
      setPageLoading(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })
}

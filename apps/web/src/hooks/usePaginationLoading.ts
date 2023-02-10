import { useEffect } from 'react'

type Props = {
  ref: React.RefObject<HTMLDivElement>
  fetch: () => Promise<any>
}

export const usePaginationLoading = ({ ref, fetch }: Props) => {
  let latestHeight: number

  const handleScroll = async () => {
    if (
      ref.current!.offsetHeight * 0.5 <= window.scrollY &&
      latestHeight !== ref.current!.offsetHeight
    ) {
      latestHeight = ref.current!.offsetHeight
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

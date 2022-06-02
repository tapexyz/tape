import useIsClient from '@utils/hooks/useIsClient'
import type { ReactNode } from 'react'

type IsBrowserProps = {
  children: ReactNode
}

const IsBrowser = ({ children }: IsBrowserProps) => {
  const isClient = useIsClient()

  if (!isClient) {
    return null
  }

  return <>{children}</>
}
export default IsBrowser

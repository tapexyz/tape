import type { ReactNode } from 'react'
import { useIsClient } from 'usehooks-ts'

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

import { Loader } from '@components/ui/Loader'
import type { ReactNode } from 'react'
import { useIsClient } from 'usehooks-ts'

type IsBrowserProps = {
  children: ReactNode
}

const IsBrowser = ({ children }: IsBrowserProps) => {
  const isClient = useIsClient()

  if (!isClient) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <Loader />
      </div>
    )
  }

  return <>{children}</>
}
export default IsBrowser

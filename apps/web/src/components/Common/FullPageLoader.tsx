import { TAPE_LOGO } from '@dragverse/constants'
import { useTheme } from 'next-themes'

import MetaTags from './MetaTags'

const FullPageLoader = () => {
  const { resolvedTheme } = useTheme()

  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      {resolvedTheme === 'dark' ? (
        <img
          src={`${TAPE_LOGO}`}
          className="h-10"
          alt="dragverse"
          height={50}
          width={180}
          draggable={false}
        />
      ) : (
        <img
          src={`${TAPE_LOGO}`}
          className="h-10"
          height={50}
          width={180}
          alt="dragverse"
          draggable={false}
        />
      )}
    </div>
  )
}

export default FullPageLoader

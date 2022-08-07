import Tooltip from '@components/UIElements/Tooltip'
import usePlayerStore from '@lib/store/player'
import { useRouter } from 'next/router'
import React from 'react'

const UpNext = () => {
  const router = useRouter()
  const upNextVideo = usePlayerStore((state) => state.upNextVideo)

  const onClick = () => {
    router.push(`/watch/${upNextVideo?.id}`)
  }

  return (
    <Tooltip content={upNextVideo?.metadata.name} placement="top">
      <button onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="md:w-7 md:h-7"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M16 18h2V6h-2M6 18l8.5-6L6 6v12Z" />
        </svg>
      </button>
    </Tooltip>
  )
}

export default UpNext

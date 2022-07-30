import Tooltip from '@components/UIElements/Tooltip'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import React from 'react'

const AutoPlay = () => {
  const { autoPlay, setAutoPlay } = usePersistStore()

  const onClick = () => {
    setAutoPlay(!autoPlay)
  }

  return (
    <button onClick={onClick}>
      <Tooltip
        content={`Autoplay is ${autoPlay ? 'on' : 'off'}`}
        placement="top"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className={clsx('md:w-6 md:h-6', { 'text-indigo-500': autoPlay })}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-2 14.5l6-4.5l-6-4.5v9Z"
            />
          </svg>
        </span>
      </Tooltip>
    </button>
  )
}

export default AutoPlay

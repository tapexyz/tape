import Tooltip from '@components/UIElements/Tooltip'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import React from 'react'

const AutoPlay = () => {
  const autoPlay = usePersistStore((state) => state.autoPlay)
  const setAutoPlay = usePersistStore((state) => state.setAutoPlay)

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
            className={clsx('md:w-6 md:h-6', {
              'opacity-100': autoPlay,
              'opacity-50': !autoPlay
            })}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12.68 6h-1.36L7 16h2l.73-2h4.54l.73 2h2L12.68 6m-2.38 6.5L12 8l1.7 4.5h-3.4m7.1 7.9L19 22h-5v-5l2 2c2.39-1.39 4-4.05 4-7c0-4.41-3.59-8-8-8s-8 3.59-8 8c0 2.95 1.61 5.53 4 6.92v2.24C4.47 19.61 2 16.1 2 12C2 6.5 6.5 2 12 2s10 4.5 10 10c0 3.53-1.83 6.62-4.6 8.4Z"
            />
          </svg>
        </span>
      </Tooltip>
    </button>
  )
}

export default AutoPlay

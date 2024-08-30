'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path
      d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
      opacity=".3"
    />
    <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
      <animateTransform
        attributeName="transform"
        type="rotate"
        dur="0.3s"
        values="0 12 12;360 12 12"
        repeatCount="indefinite"
      />
    </path>
  </svg>
)

const Success = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_114_308)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.75 13C1.75 19.2129 6.78656 24.2494 12.9995 24.2494C19.2124 24.2494 24.249 19.2129 24.249 13C24.249 6.78705 19.2124 1.75049 12.9995 1.75049C6.78656 1.75049 1.75 6.78705 1.75 13ZM18.3724 11.1447C18.8666 10.6626 18.8763 9.87119 18.3942 9.37705C17.9121 8.88291 17.1207 8.87316 16.6266 9.35526L11.384 14.4702L9.40624 12.386C8.93103 11.8852 8.13984 11.8645 7.63907 12.3397C7.1383 12.8149 7.11758 13.6061 7.59279 14.1069L10.443 17.1104C10.6733 17.3531 10.9912 17.4933 11.3256 17.4997C11.6601 17.5062 11.9832 17.3783 12.2226 17.1447L18.3724 11.1447Z"
        fill="currentColor"
      />
      <path
        d="M12.9995 24.2494C6.78656 24.2494 1.75 19.2129 1.75 13C1.75 6.78705 6.78656 1.75049 12.9995 1.75049C19.2124 1.75049 24.249 6.78705 24.249 13C24.249 19.2129 19.2124 24.2494 12.9995 24.2494Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </g>
    <defs>
      <clipPath id="clip0_114_308">
        <rect width="26" height="26" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default function WinderPage() {
  const [state, setState] = useState<'default' | 'success' | 'loading'>(
    'default'
  )

  return (
    <div className="grid h-screen place-items-center">
      <div>
        <motion.button
          transition={{
            type: 'spring',
            bounce: 0.3,
            duration: 0.4
          }}
          className="relative flex items-center overflow-hidden rounded-full bg-[#00C979] px-4 py-1 text-lg font-semibold text-white shadow"
          onClick={() => {
            setState('loading')
            setTimeout(() => {
              setState('success')
              setTimeout(() => {
                setState('default')
              }, 1000)
            }, 2000)
          }}
          layout="position"
          disabled={state === 'loading' || state === 'success'}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {state === 'loading' && (
              <motion.span
                key="loading"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, dur: 0 }}
                transition={{ type: 'tween', duration: 0.2 }}
              >
                <Spinner className="mr-1.5 size-5" />
              </motion.span>
            )}
            {state === 'success' && (
              <motion.span
                key="success"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'tween', duration: 0.2 }}
              >
                <Success className="mr-1.5 size-5" />
              </motion.span>
            )}
          </AnimatePresence>
          <span>Post</span>
          <AnimatePresence mode="popLayout" initial={false}>
            {(state === 'loading' || state === 'success') && (
              <motion.span
                key={state}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'tween', duration: 0.2 }}
              >
                {state === 'loading' ? 'ing' : 'ed'}
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout" initial={false}>
            {state === 'default' && (
              <motion.span
                key="now"
                className="ml-1"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 30, opacity: 0 }}
                transition={{ type: 'tween', duration: 0.2 }}
              >
                Now
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}

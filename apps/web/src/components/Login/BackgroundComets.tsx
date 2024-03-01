'use client'
import { motion } from 'framer-motion'
import React, { memo } from 'react'

const paths = [
  'M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859',
  'M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795',
  'M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731',
  'M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667',
  'M-142 -461C-142 -461 -74 -56 390 71C861 190 929 595 929 595',
  'M-86 -525C-86 -525 -18 -120 446 7C917 126 985 531 985 531'
]

const BackgroundComets = () => {
  return (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center [mask-repeat:no-repeat] [mask-size:40px]">
      <svg
        className="pointer-events-none absolute z-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((path, index) => (
          <motion.path
            key={index}
            d={path}
            stroke={`url(#linearGradient-${index})`}
            strokeOpacity="0.4"
            strokeWidth="0.8"
          />
        ))}
        <defs>
          {paths.map((_path, index) => (
            <motion.linearGradient
              id={`linearGradient-${index}`}
              x1="100%"
              x2="100%"
              y1="100%"
              y2="100%"
              key={`gradient-${index}`}
              animate={{
                x1: ['0%', '100%'],
                x2: ['0%', '95%'],
                y1: ['0%', '100%'],
                y2: ['0%', `${93 + Math.random() * 8}%`]
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                ease: 'easeOut',
                repeat: Infinity,
                delay: Math.random() * 10
              }}
            >
              <stop stopColor="#FF5733" stopOpacity="0"></stop>
              <stop stopColor="#FF5733"></stop>
              <stop offset="67.5%" stopColor="#FFD700"></stop>
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0"></stop>
            </motion.linearGradient>
          ))}

          <radialGradient
            id="paint0_radial_242_278"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
          >
            <stop offset="0.0666667" stopColor="var(--neutral-300)"></stop>
            <stop offset="0.243243" stopColor="var(--neutral-300)"></stop>
            <stop offset="0.43594" stopColor="white" stopOpacity="0"></stop>
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

export default memo(BackgroundComets)

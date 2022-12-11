import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import type { FC, ReactNode } from 'react'
import React from 'react'

const variants = {
  out: {
    opacity: 0,
    y: 0,
    transition: {
      duration: 0.1
    }
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1
    }
  }
}

type Props = {
  children: ReactNode
}

const Animated: FC<Props> = ({ children }) => {
  const { asPath } = useRouter()

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={asPath}
        variants={variants}
        animate="in"
        initial="out"
        exit="out"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default Animated

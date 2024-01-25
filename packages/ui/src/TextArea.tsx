import { tw } from '@tape.xyz/browser'
import { motion, useAnimation } from 'framer-motion'
import type { ComponentProps } from 'react'
import { forwardRef, useEffect, useId } from 'react'

const ShakeAnimation = {
  hidden: { marginLeft: 0 },
  shake: {
    marginLeft: [0, 2, -2, 0],
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  }
}

interface TextAreaProps extends Omit<ComponentProps<'textarea'>, 'prefix'> {
  label?: string
  info?: string
  error?: string
  showError?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, ...props }, ref) => {
    const id = useId()
    const controls = useAnimation()

    const handleErrorAlert = () => {
      if (error?.length) {
        return controls.start('shake')
      }
      controls.start('hidden')
    }

    useEffect(() => {
      handleErrorAlert()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    return (
      <label className="w-full" htmlFor={id}>
        {label ? (
          <div className="mb-1 flex items-center space-x-1.5 text-sm font-medium text-gray-800 dark:text-gray-200">
            {label}
          </div>
        ) : null}
        <motion.div
          animate={controls}
          variants={ShakeAnimation}
          className="flex w-full items-center rounded-lg text-sm"
        >
          <textarea
            className={tw(
              { 'placeholder:text-red-500': error },
              'w-full rounded-lg border-none bg-gray-100 px-3 py-2 focus:outline-none dark:bg-gray-900',
              className
            )}
            id={id}
            ref={ref}
            {...props}
          />
        </motion.div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </label>
    )
  }
)

TextArea.displayName = 'TextArea'

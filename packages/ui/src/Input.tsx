import { tw } from '@tape.xyz/browser'
import { motion, useAnimation } from 'framer-motion'
import type { ComponentProps, ReactNode } from 'react'
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

interface InputProps extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string
  info?: string
  prefix?: ReactNode | string
  suffix?: ReactNode | string
  error?: string
  showError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, prefix, suffix, showError = true, error, ...props },
    ref
  ) => {
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
        <div className="flex text-sm">
          {prefix ? (
            <span className="inline-flex items-center rounded-l-lg bg-gray-200/80 px-3 dark:bg-gray-800">
              {prefix}
            </span>
          ) : null}
          <motion.div
            animate={controls}
            variants={ShakeAnimation}
            className={tw(
              prefix ? 'rounded-r-lg' : 'rounded-lg',
              'flex w-full items-center'
            )}
          >
            <input
              className={tw(
                { 'placeholder:text-red-500': error },
                prefix
                  ? 'rounded-r-lg'
                  : suffix
                    ? 'rounded-l-lg'
                    : 'rounded-lg',
                'w-full border-none bg-gray-100 px-3 py-2 focus:outline-none dark:bg-gray-900',
                className
              )}
              id={id}
              ref={ref}
              {...props}
            />
          </motion.div>
          {suffix ? (
            <span className="inline-flex items-center rounded-r-lg bg-gray-200/80 px-3 dark:bg-gray-800">
              {suffix}
            </span>
          ) : null}
        </div>
        {error && showError ? (
          <p className="p-1 text-xs font-medium text-red-500">{error}</p>
        ) : null}
      </label>
    )
  }
)

Input.displayName = 'Input'

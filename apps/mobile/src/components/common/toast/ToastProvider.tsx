import type { PropsWithChildren } from 'react'
import React, { useCallback, useRef, useState } from 'react'

import { Toast, type ToastProps } from './Toast'
import { ToastContext } from './ToastContext'

const toastDuration = 3000 // 3 secs

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [toastProps, setToastProps] = useState<ToastProps>({ text: '' })
  const [isVisible, setIsVisible] = useState(false)

  const showToast = useCallback((props: ToastProps) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }

    setToastProps(props)
    setIsVisible(true)

    toastTimeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, toastDuration)

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  const hideToast = useCallback(() => {
    setIsVisible(false)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast {...toastProps} text={toastProps?.text} isVisible={isVisible} />
    </ToastContext.Provider>
  )
}

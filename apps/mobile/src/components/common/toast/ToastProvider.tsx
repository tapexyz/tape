import type { PropsWithChildren } from 'react'
import React, { useCallback, useState } from 'react'

import { Toast, type ToastProps } from './Toast'
import { ToastContext } from './ToastContext'

const toastDuration = 3000

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toastProps, setToastProps] = useState<ToastProps>({ text: '' })
  const [isVisible, setIsVisible] = useState(false)

  const showToast = useCallback((props: ToastProps) => {
    setToastProps(props)
    setIsVisible(true)
    setTimeout(() => {
      setIsVisible(false)
    }, toastDuration)
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

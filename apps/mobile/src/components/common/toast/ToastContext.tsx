import { createContext, useContext } from 'react'

import type { ToastProps } from './Toast'

export const ToastContext = createContext({})

export const useToast = () => {
  return useContext(ToastContext) as {
    showToast: (props: ToastProps) => void
    hideToast: () => void
  }
}

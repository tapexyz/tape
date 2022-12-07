import type { ReactNode } from 'react'
import React, { Component } from 'react'
import Custom500 from 'src/pages/500'
import logger from 'utils/logger'

interface Props {
  children?: ReactNode
}
interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error) {
    console.error('Uncaught error:', error)
    logger.error('[ERROR BOUNDARY]', error)
  }

  public render() {
    if (this.state.hasError) {
      return <Custom500 />
    }
    return this.props.children
  }
}

export default ErrorBoundary

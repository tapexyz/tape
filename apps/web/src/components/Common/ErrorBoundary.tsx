import { logger } from '@lenstube/generic'
import type { ReactNode } from 'react'
import React, { Component } from 'react'
import Custom500 from 'src/pages/500'

interface Props {
  children?: ReactNode
}
interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state = {
    hasError: false
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    logger.error('[ERROR BOUNDARY]', error)
  }

  render() {
    if (this.state.hasError) {
      return <Custom500 />
    }
    return this.props.children
  }
}

export default ErrorBoundary

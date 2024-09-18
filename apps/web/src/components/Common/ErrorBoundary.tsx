import { logger } from "@tape.xyz/generic";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import Custom500 from "src/pages/500";

interface Props {
  children?: ReactNode;
}
interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state = {
    hasError: false
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(
      "[ERROR BOUNDARY]",
      `${JSON.stringify(error)} - ${JSON.stringify(errorInfo)}`
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <Custom500 />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

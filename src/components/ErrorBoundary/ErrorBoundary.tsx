import { Component } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true, error: _ };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="wpqt-flex wpqt-h-screen wpqt-items-center wpqt-justify-center wpqt-text-center wpqt-text-lg">
          {__("Something went wrong. Please refresh the page.", "quicktasker")}
          <br />
          {this.state.error?.message}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

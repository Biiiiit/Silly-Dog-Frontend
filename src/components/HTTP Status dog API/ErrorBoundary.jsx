import React from "react";
import ErrorDisplay from "./ErrorDisplay";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorCode: null };
  }

  static getDerivedStateFromError(error) {
    // Check if the error is a network error and set a custom error code
    let errorCode = 500;
    if (error.code === "ERR_NETWORK") {
      errorCode = 503; // Service Unavailable for network errors
    } else if (error.code) {
      errorCode = error.code;
    }
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorCode: errorCode };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Update state to display the fallback UI
    this.setState({ hasError: true, errorCode: 500 }); // You can set a custom error code here
  }

  componentDidMount() {
    // Add listener for uncaught errors
    window.onerror = (message, source, lineno, colno, error) => {
      // Log the error to the console
      console.error("Uncaught error caught by ErrorBoundary:", error);
      // Update state to display the fallback UI
      this.setState({ hasError: true, errorCode: 500 }); // You can set a custom error code here
    };
  }

  componentWillUnmount() {
    // Remove the listener when the component is unmounted
    window.onerror = null;
  }

  render() {
    if (this.state.hasError) {
      // Render any custom fallback UI
      return <ErrorDisplay errorCode={this.state.errorCode} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

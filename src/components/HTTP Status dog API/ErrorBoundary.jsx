import React from "react";
import ErrorDisplay from "./ErrorDisplay";
import axios from "axios";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorCode: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorCode: 500 };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Update state to display the fallback UI
    this.setState({ hasError: true, errorCode: 500 }); // You can set a custom error code here
  }

  handleErrorClose = () => {
    this.setState({ hasError: false });
  };

  componentDidMount() {
    // Intercept Axios errors globally
    this.responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Log the error to the console
        console.error("Axios error caught by ErrorBoundary:", error);
        // Check if the error code is ERR_NETWORK and update it to 500
        const errorCode =
          error.code === "ERR_NETWORK" ? 500 : error.code || 500;
        // Update state to display the fallback UI
        this.setState({ hasError: true, errorCode: errorCode });
        return Promise.reject(error);
      }
    );
  }

  componentWillUnmount() {
    // Remove Axios interceptor when the component is unmounted
    axios.interceptors.response.eject(this.responseInterceptor);
  }

  render() {
    const { hasError, errorCode } = this.state;

    if (hasError) {
      // Render the error popup
      return (
        <>
          {this.props.children}
          <ErrorDisplay errorCode={errorCode} onClose={this.handleErrorClose} />
        </>
      );
    }

    // Render the children
    return this.props.children;
  }
}

export default ErrorBoundary;

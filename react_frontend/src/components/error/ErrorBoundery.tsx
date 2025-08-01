
import React from 'react';
import ErrorFallbackUI from './ErrorBounderyFallbackUi';
import type{ ErrorBoundaryProps, ErrorBoundaryState, ErrorInfo } from '../../types/errorboundery.types';

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isRetrying: false 
    };
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {

    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ isRetrying: true });

    setTimeout(() => {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        isRetrying: false 
      });
    }, 500);
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            retry={this.handleRetry}
            goHome={this.handleGoHome}
            isRetrying={this.state.isRetrying}
          />
        );
      }

      return (
        <ErrorFallbackUI
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retry={this.handleRetry}
          goHome={this.handleGoHome}
          isRetrying={this.state.isRetrying}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
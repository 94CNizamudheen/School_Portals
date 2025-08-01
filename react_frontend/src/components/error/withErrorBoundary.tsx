

import React from 'react';
import ErrorBoundary from './ErrorBoundery';
import type { ErrorFallbackProps } from '../../types/errorboundery.types';

export interface WithErrorBoundaryOptions {
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: unknown) => void;
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) => {
  const WithErrorBoundaryComponent = (props: P) => {
    return (
      <ErrorBoundary 
        fallback={options.fallback}
        onError={options.onError}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // Set display name for debugging
  WithErrorBoundaryComponent.displayName = 
    `withErrorBoundary(${Component.displayName || Component.name})`;

  return WithErrorBoundaryComponent;
};

export default withErrorBoundary;
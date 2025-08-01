

import type { ErrorInfo } from "../../types/errorboundery.types";


export const logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
  
  console.error('Error logged to service:', error, errorInfo);
};

export const getUserFriendlyErrorMessage = (error: Error): string => {
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('network')) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }

  if (errorMessage.includes('timeout')) {
    return 'The request took too long to complete. Please try again.';
  }

  if (errorMessage.includes('unauthorized') || errorMessage.includes('403')) {
    return 'You don\'t have permission to access this resource.';
  }

  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return 'The requested resource was not found.';
  }

  if (errorMessage.includes('map is not a function')) {
    return 'Data format issue. The page will be refreshed automatically.';
  }

  return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
};

export const isRecoverableError = (error: Error): boolean => {
  const errorMessage = error.message.toLowerCase();
  
  const recoverableErrors = [
    'network',
    'timeout',
    'fetch',
    'map is not a function',
    'cannot read property',
    'undefined'
  ];

  return recoverableErrors.some(keyword => errorMessage.includes(keyword));
};

/**
 * Generate error report
 */
export const generateErrorReport = (error: Error, errorInfo: ErrorInfo) => {
  return {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    errorInfo: {
      componentStack: errorInfo.componentStack,
    },
    environment: {
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    },
    buildInfo: {
      version: process.env.REACT_APP_VERSION || 'unknown',
      environment: process.env.NODE_ENV,
    },
  };
};
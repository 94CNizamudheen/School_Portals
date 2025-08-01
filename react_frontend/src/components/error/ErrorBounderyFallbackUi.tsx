
import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import type { ErrorFallbackProps } from '../../types/errorboundery.types';

const ErrorFallbackUI: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  retry,
  goHome,
  isRetrying
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={retry}
            disabled={isRetrying}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </button>
          
          <button
            onClick={goHome}
            className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </div>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <div className="border-t pt-8">
            <div className="flex items-center mb-4">
              <Bug className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Error Details (Development Mode)
              </h3>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-800 mb-2">Error Message:</h4>
              <p className="text-red-700 font-mono text-sm">
                {error.toString()}
              </p>
            </div>

            {errorInfo && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Stack Trace:</h4>
                <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500 mt-8">
          If this problem persists, please contact support with the error details above.
        </div>
      </div>
    </div>
  );
};

export default ErrorFallbackUI;
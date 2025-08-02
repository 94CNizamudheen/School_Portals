
import React from 'react';
import { AlertTriangle, RefreshCw, Home, } from 'lucide-react';
import type { ErrorFallbackProps } from '../../types/errorboundery.types';

const ErrorFallbackUI: React.FC<ErrorFallbackProps> = ({
  retry,
  goHome,
  isRetrying
}) => {


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
        {/* Help Text */}
        <div className="text-center text-sm text-gray-500 mt-8">
          If this problem persists, please contact support with the error details above.
        </div>
      </div>
    </div>
  );
};

export default ErrorFallbackUI;
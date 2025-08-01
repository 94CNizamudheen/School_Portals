

import React from 'react';


export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const throwError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  return throwError;
};


export const useAsyncErrorHandler = () => {
  const throwError = useErrorHandler();

  const handleAsyncError = React.useCallback((error: Error) => {
    console.error('Async error caught:', error);

    throwError(error);
  }, [throwError]);

  return handleAsyncError;
};

export const useSafeAsync = () => {
  const handleAsyncError = useAsyncErrorHandler();

  const safeAsync = React.useCallback(async <T>(
    asyncFn: () => Promise<T>,
    fallbackValue?: T
  ): Promise<T | undefined> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleAsyncError(error instanceof Error ? error : new Error(String(error)));
      return fallbackValue;
    }
  }, [handleAsyncError]);

  return safeAsync;
};
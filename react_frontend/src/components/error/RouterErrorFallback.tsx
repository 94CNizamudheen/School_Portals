import ErrorFallbackUI from "./ErrorBounderyFallbackUi";

const RouterErrorFallback = ({error}:{error?:unknown}) => {
     const safeError = error instanceof Error ? error : new Error("Unknown error");
  return (
    <ErrorFallbackUI
      error={new Error("Something went wrong")}
      errorInfo={{ componentStack:safeError.stack|| "No stack trace available" }}
      retry={() => window.location.reload()}
      goHome={() => (window.location.href = "/")}
      isRetrying={false}
    />
  );
};

export default RouterErrorFallback;
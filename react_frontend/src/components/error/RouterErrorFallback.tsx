import ErrorFallbackUI from "./ErrorBounderyFallbackUi";

const RouterErrorFallback = () => {
  return (
    <ErrorFallbackUI
      error={new Error("Something went wrong")}
      errorInfo={{ componentStack: "" }}
      retry={() => window.location.reload()}
      goHome={() => (window.location.href = "/")}
      isRetrying={false}
    />
  );
};

export default RouterErrorFallback;
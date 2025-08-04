

const ProcessingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 bg-gradient-to-r from-gray-950 to-gray-600 dark:from-zinc-900 dark:to-zinc-700 p-6 rounded-xl shadow-2xl">
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full" />
        <span className="text-sm text-gray-200 dark:text-gray-300 font-medium">Processing...</span>
      </div>
    </div>
  );
};

export default ProcessingSpinner;

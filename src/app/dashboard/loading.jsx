
const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">Loading dashboard...</span>
    </div>
  );
};

export default Loading;

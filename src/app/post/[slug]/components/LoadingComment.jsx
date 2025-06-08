export default function LoadingCommment() {
  return (
      <div className="w-full flex items-center justify-center  bg-opacity-80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg" />
        <p className="text-white text-xl font-semibold animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}

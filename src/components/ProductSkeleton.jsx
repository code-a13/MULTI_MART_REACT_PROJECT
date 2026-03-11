export default function ProductSkeleton() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col h-full animate-pulse">
      <div className="h-48 w-full bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="mt-auto flex justify-between items-center pt-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}
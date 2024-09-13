const SuggestedShimmer = () => {
  return (
    <div className="w-full rounded-md">
      <div className="flex animate-shimmer space-x-2">
        <div className="h-24 w-44 rounded-small bg-gray-200 dark:bg-gray-800" />
        <div className="flex flex-1 flex-col space-y-2 py-1">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default SuggestedShimmer;

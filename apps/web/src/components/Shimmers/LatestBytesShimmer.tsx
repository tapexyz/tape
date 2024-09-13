import { useMemo } from "react";

const LatestBytesShimmer = ({ count = 15 }: { count?: number }) => {
  const cards = useMemo(() => Array(count).fill(1), [count]);
  return (
    <div className="animate-shimmer">
      <div className="no-scrollbar relative mb-8 flex items-start space-x-4 overflow-x-auto scroll-smooth">
        {cards.map((i, idx) => (
          <div key={`${i}_${idx}`} className="space-y-1.5">
            <div className="aspect-[9/16] h-[350px] ultrawide:h-[400px] ultrawide:w-[260px] w-[220px] rounded-large bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestBytesShimmer;

import { tw } from "@tape.xyz/browser";

const ButtonShimmer = ({ className = "h-10" }: { className?: string }) => {
  return (
    <div className="animate-shimmer w-full">
      <div
        className={tw(
          "w-full rounded-lg bg-gray-200 dark:bg-gray-800",
          className,
        )}
      />
    </div>
  );
};

export default ButtonShimmer;

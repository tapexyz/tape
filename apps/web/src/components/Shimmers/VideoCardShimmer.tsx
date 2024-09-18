import { tw } from "@tape.xyz/browser";

export const CardShimmer = ({ rounded = true }: { rounded?: boolean }) => {
  return (
    <div className={tw("w-full", rounded && "rounded-xl")}>
      <div className="flex animate-shimmer flex-col space-x-2">
        <div
          className={tw(
            "aspect-h-9 aspect-w-16 bg-gray-200 dark:bg-gray-800",
            rounded && "rounded-large"
          )}
        />
      </div>
    </div>
  );
};

const VideoCardShimmer = () => {
  return (
    <div className="w-full rounded-xl">
      <div className="flex animate-shimmer flex-col">
        <div className="aspect-h-9 aspect-w-16 rounded-medium bg-gray-200 dark:bg-gray-800" />
        <div className="flex space-x-2 py-2">
          <div className="size-8 flex-none rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex w-full flex-col space-y-2">
            <div className="h-3 w-full rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-full rounded-md bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardShimmer;

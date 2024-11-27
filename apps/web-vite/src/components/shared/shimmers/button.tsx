import { tw } from "@tape.xyz/winder";

export const ButtonShimmer = ({
  className = "h-11"
}: { className?: string }) => {
  return (
    <div className="w-full animate-shimmer">
      <div className={tw("w-full rounded-custom bg-secondary", className)} />
    </div>
  );
};

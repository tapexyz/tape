import { ArrowsClockwise, Eye, Heart, Lightning } from "@tape.xyz/winder";
import { memo } from "react";

export const Stats = memo(() => {
  return (
    <div className="flex items-center space-x-3 py-2 font-medium text-sm">
      <span className="inline-flex items-center space-x-1">
        <Eye className="size-4" weight="fill" />
        <span>100k</span>
      </span>
      <div className="h-4 w-[1px] rounded-sm bg-primary/10" />
      <span className="inline-flex items-center space-x-1">
        <Heart className="size-4" weight="fill" />
        <span>12k</span>
      </span>
      <div className="h-4 w-[1px] rounded-sm bg-primary/10" />
      <span className="inline-flex items-center space-x-1">
        <Lightning className="size-4" weight="fill" />
        <span>4.2k</span>
      </span>
      <div className="h-4 w-[1px] rounded-sm bg-primary/10" />
      <span className="inline-flex items-center space-x-1">
        <ArrowsClockwise className="size-4" weight="fill" />
        <span>4.2k</span>
      </span>
    </div>
  );
});

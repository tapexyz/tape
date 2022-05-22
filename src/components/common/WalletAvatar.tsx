import { emojiAvatarForAddress } from "@utils/functions/emojiForAddress";
import React, { useMemo } from "react";

interface AvatarProps {
  size: number;
  imageUrl?: string | null;
  address: string;
}

export function Avatar({ address, imageUrl, size }: AvatarProps) {
  const { color: backgroundColor, emoji } = useMemo(
    () => emojiAvatarForAddress(address),
    [address]
  );

  return (
    <div
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
      className={`relative overflow-hidden rounded-full pointer-events-none`}
    >
      <div
        style={{
          backgroundColor,
          fontSize: `${Math.round(size * 0.55)}px`,
          height: `${size}px`,
          transition: ".25s ease",
          transitionDelay: ".1s",
          width: `${size}px`,
        }}
        className="absolute flex items-center justify-center overflow-hidden rounded-full pointer-events-none"
      >
        {imageUrl ? (
          <div
            className="absolute object-cover w-full rounded-full"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : null}
        {emoji}
      </div>
    </div>
  );
}

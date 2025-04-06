import { Link } from "@tanstack/react-router";
import { memo } from "react";
import { TapeSvg } from "../tape-svg";

export const Logo = memo(() => {
  return (
    <Link
      to="/"
      onContextMenu={(e) => {
        e.preventDefault();
        window.open("/winder#brand", "_blank");
      }}
    >
      <div className="flex h-9 items-center rounded-custom border border-custom px-3.5 pt-2.5 pb-2">
        <TapeSvg className="h-5 text-primary" />
      </div>
    </Link>
  );
});

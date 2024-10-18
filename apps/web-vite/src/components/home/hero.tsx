import { Link } from "@tanstack/react-router";
import { memo } from "react";

export const Hero = memo(() => {
  return (
    <div className="flex h-[440px] flex-col justify-between rounded-card bg-theme p-5">
      <h1 className="font-serif text-2xl lg:text-6xl">
        Welcome to &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tape&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;).
        <p>
          New way of sharing media online. Connect, Create, and Share with
          creators from all around the world.
        </p>
      </h1>
      <div className="space-x-4 *:underline *:underline-offset-2">
        <Link to="/">Create an account</Link>
        <Link to="/">Sign in</Link>
      </div>
    </div>
  );
});

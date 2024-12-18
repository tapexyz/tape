import { useCookieStore } from "@/store/cookie";
import { Link } from "@tanstack/react-router";
import { memo } from "react";

export const Hero = memo(() => {
  const isAuthenticated = useCookieStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return null;
  }

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
        <Link to="/sign-in">Create an account</Link>
        <Link to="/sign-in">Sign in</Link>
      </div>
    </div>
  );
});

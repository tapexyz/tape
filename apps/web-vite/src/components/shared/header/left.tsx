import { Link, useMatchRoute } from "@tanstack/react-router";
import { tw } from "@tape.xyz/winder";
import { Button, ThemeSwitcher } from "@tape.xyz/winder";
import { memo } from "react";
import { Logo } from "./logo";

export const LeftSection = memo(() => {
  const matchRoute = useMatchRoute();
  const isActive =
    matchRoute({ to: "/" }) ||
    matchRoute({ to: "/explore" }) ||
    matchRoute({ to: "/following" });

  return (
    <div className="inline-flex w-1/3 gap-1.5">
      <Logo />
      <ThemeSwitcher />
      <Button
        variant="secondary"
        className="hidden p-0 font-medium text-sm backdrop-blur-3xl lg:block"
      >
        <div className="inline-flex items-center">
          <Link
            to="/"
            preload="viewport"
            className={tw(
              "py-2 pr-3 pl-4 transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-primary/40"
            )}
          >
            Discover
          </Link>
          <div className="h-3 w-[1px] rounded-sm bg-primary/10" />
          <Link to="/feed" preload="viewport">
            {({ isActive }) => {
              return (
                <span
                  className={tw(
                    "py-2 pr-4 pl-3 transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-primary/40"
                  )}
                >
                  Feed
                </span>
              );
            }}
          </Link>
        </div>
      </Button>
    </div>
  );
});

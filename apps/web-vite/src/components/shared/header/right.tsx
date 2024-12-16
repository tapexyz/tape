import { useCookieStore } from "@/store/cookie";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Button, PlusCircle } from "@tape.xyz/winder";
import { memo } from "react";
import { Notifications } from "./notifications";
import { UserMenu } from "./user-menu";

export const RightSection = memo(() => {
  const isAuthenticated = useCookieStore((state) => state.isAuthenticated);

  if (!isAuthenticated)
    return (
      <div className="flex w-1/3 justify-end">
        <Link to="/sign-in">
          <Button className="group">
            <span className="mr-2">Sign in</span>
            <ArrowRight className="size-3 opacity-80 transition duration-150 ease-linear group-hover:translate-x-6 group-hover:opacity-0" />
            <ArrowRight className="-ml-4 -translate-x-2 size-3 opacity-0 transition duration-150 ease-linear group-hover:translate-x-0 group-hover:opacity-100" />
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="flex w-1/3 justify-end gap-1.5">
      <Notifications />
      <Link to="/create">
        <Button>
          <span>Create</span>
          <PlusCircle className="size-5" weight="fill" />
        </Button>
      </Link>
      <UserMenu />
    </div>
  );
});

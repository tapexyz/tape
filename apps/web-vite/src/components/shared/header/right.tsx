import { signOut, useCookieStore } from "@/store/cookie";
import { Link } from "@tanstack/react-router";
import { WORKER_AVATAR_URL } from "@tape.xyz/constants";
import {
  ArrowRight,
  Avatar,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  PlusCircle,
  SignOut,
  User
} from "@tape.xyz/winder";
import { memo } from "react";
import { Notifications } from "./notifications";

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
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-custom">
          <Avatar size="md" className="select-none">
            <AvatarImage src={`${WORKER_AVATAR_URL}/0x2d`} />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="flex items-center gap-2">
            <User />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <PlusCircle />
            <span>Create</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => signOut()}
          >
            <SignOut />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

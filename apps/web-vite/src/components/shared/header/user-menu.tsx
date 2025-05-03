import { getAccountMetadata } from "@/helpers/metadata";
import { useMeSuspenseQuery } from "@/queries/account";
import { useAccountStore } from "@/store/account";
import { signOut } from "@/store/cookie";
import { Link } from "@tanstack/react-router";
import type { Account } from "@tape.xyz/indexer";
import {
  Avatar,
  AvatarImage,
  CaretDown,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ScrollArea,
  SignOut,
  SlidersHorizontal,
  User,
  VinylRecord,
  tw
} from "@tape.xyz/winder";
import { useMeasure } from "@uidotdev/usehooks";
import { AnimatePresence, m } from "motion/react";
import { memo, useEffect, useState } from "react";
import { Accounts } from "./accounts";

export const UserMenu = memo(() => {
  const [showAccounts, setShowAccounts] = useState(false);
  const [elementRef, bounds] = useMeasure();
  const { data, isSuccess } = useMeSuspenseQuery();
  const { setCurrentAccount } = useAccountStore();

  if (!data) return null;

  const account = data.me.loggedInAs.account as Account;
  const { name, handleWithPrefix, picture, handle } =
    getAccountMetadata(account);

  useEffect(() => {
    if (isSuccess) {
      setCurrentAccount(account);
    }
  }, [isSuccess]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-custom">
        <Avatar size="md" className="select-none">
          <AvatarImage src={picture} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 py-2 pr-3 pl-2"
          onClick={() => setShowAccounts(!showAccounts)}
        >
          <div className="flex items-center justify-between gap-2.5">
            <Avatar size="lg">
              <AvatarImage src={picture} />
            </Avatar>
            <div className="flex flex-col justify-center text-left">
              <span className="font-medium text-sm">{name}</span>
              <span className="text-muted text-xs">{handleWithPrefix}</span>
            </div>
          </div>
          <CaretDown className={tw(showAccounts && "rotate-180")} />
        </button>
        <DropdownMenuSeparator />
        <m.div
          animate={{
            height: bounds.height ? bounds.height : undefined,
            transition: { duration: 0.1, type: "spring", bounce: 0 }
          }}
        >
          <div ref={elementRef} className="flex flex-col justify-end">
            <AnimatePresence mode="popLayout" initial={false}>
              <m.div
                key={showAccounts ? "open" : "close"}
                initial={{ opacity: 0, filter: "blur(2px)" }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: { duration: 0.1 }
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(2px)",
                  transition: { duration: 0 }
                }}
              >
                {showAccounts ? (
                  <ScrollArea className="-mx-2 h-64 max-h-64">
                    <Accounts />
                  </ScrollArea>
                ) : (
                  <>
                    <Link
                      to="/u/$handle"
                      params={{ handle: handle as string }}
                      search={{ media: "videos" }}
                    >
                      <DropdownMenuItem className="flex items-center gap-2 py-2">
                        <User className="size-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/settings/me">
                      <DropdownMenuItem className="flex items-center gap-2 py-2">
                        <VinylRecord className="size-4" />
                        <span>Studio</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/settings/me">
                      <DropdownMenuItem className="flex items-center gap-2 py-2">
                        <SlidersHorizontal className="size-4 rotate-90" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center gap-2 py-2 focus:bg-destructive/5 dark:focus:bg-destructive/10"
                      onClick={() => signOut()}
                    >
                      <SignOut className="size-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </>
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </m.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

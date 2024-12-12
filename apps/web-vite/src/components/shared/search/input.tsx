import { useSearchQuery } from "@/queries/search";
import type { Account, Post } from "@tape.xyz/indexer";
import { X } from "@tape.xyz/winder";
import {
  DialogHeader,
  DialogTitle,
  MagnifyingGlass,
  tw
} from "@tape.xyz/winder";
import { useDebounce } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";
import { SearchResults } from "./results";

export const SearchInput = ({ onNavigate }: { onNavigate: () => void }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useSearchQuery(useDebounce(searchTerm, 300));
  const posts = data?.posts.items as Post[];
  const accounts = data?.accounts.items as Account[];

  const results = useMemo(
    () => [
      ...(accounts?.map((account) => ({
        type: "account" as const,
        id: account.username?.localName as string,
        label: account.username?.localName as string
      })) ?? []),
      ...(posts?.map((post) => ({
        type: "post" as const,
        id: post.id as string,
        label: post.metadata.content as string
      })) ?? [])
    ],
    [accounts, posts]
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-muted">
              <MagnifyingGlass className="size-4" weight="bold" />
            </span>
            <input
              className="w-full border-custom border-b bg-transparent px-10 py-4 font-normal text-sm outline-none"
              placeholder="Type to search tape"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className={tw(
                searchTerm
                  ? "absolute right-4 text-muted transition-colors hover:text-primary"
                  : "hidden"
              )}
            >
              <X className="size-4" weight="bold" />
            </button>
          </div>
        </DialogTitle>
      </DialogHeader>

      <SearchResults results={results} onNavigate={onNavigate} />
    </>
  );
};

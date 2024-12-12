import { Link } from "@tanstack/react-router";
import { Play, User } from "@tape.xyz/winder";
import { ScrollArea } from "@tape.xyz/winder";
import { memo } from "react";

type SearchResultsProps = {
  results: { type: "account" | "post"; id: string; label: string }[];
  onNavigate: () => void;
};

export const SearchResults = memo(
  ({ results, onNavigate }: SearchResultsProps) => {
    return (
      <ScrollArea className="h-96">
        <div className="p-2 text-primary/80">
          <h6 className="flex h-8 items-center px-3 font-medium text-xs">
            Suggestions
          </h6>
          <ul className="text-sm">
            {results?.map(({ id, label, type }) => {
              const isAccount = type === "account";
              const Icon = isAccount ? User : Play;
              return (
                <Link
                  key={id}
                  to={isAccount ? "/u/$handle" : "/watch/$postId"}
                  params={{
                    handle: id,
                    postId: id
                  }}
                  search={isAccount && { media: "videos" }}
                  onClick={onNavigate}
                >
                  <li className="group flex items-center space-x-1.5 rounded-custom px-3 py-2 transition-colors hover:bg-secondary">
                    <Icon className="opacity-50 transition-opacity group-hover:opacity-100" />
                    <span className="relative transition-colors group-hover:text-primary">
                      {label}
                    </span>
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </ScrollArea>
    );
  }
);

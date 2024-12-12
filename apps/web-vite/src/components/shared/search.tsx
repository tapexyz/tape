import { Link } from "@tanstack/react-router";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  MagnifyingGlass,
  Play,
  ScrollArea,
  User,
  X,
  tw
} from "@tape.xyz/winder";
import { useDebounce } from "@uidotdev/usehooks";
import { m } from "motion/react";
import { memo, useState } from "react";

const data = [
  {
    label: "sasicodes",
    type: "user"
  },
  {
    label: "tape",
    type: "user"
  },
  {
    label: "Debugging React is fun 🤡",
    type: "publication"
  },
  {
    label: "Just resolved a merge conflict of 400 files 😵‍💫",
    type: "publication"
  }
];

const List = ({ onNavigate }: { onNavigate: () => void }) => {
  const [hoverId, setHoverId] = useState("");

  return (
    <ul className="text-sm">
      {data.map((item) => {
        const isUser = item.type === "user";
        const Icon = memo(isUser ? User : Play);
        return (
          <Link
            key={item.label}
            to={isUser ? "/u/$handle" : "/watch/$postId"}
            params={{
              handle: isUser ? item.label : "",
              postId: "0x2d-0x022f-DA-7918bc14"
            }}
            onClick={onNavigate}
          >
            <li
              onFocus={() => setHoverId(item.label)}
              onMouseEnter={() => setHoverId(item.label)}
              onMouseLeave={() => setHoverId(item.label)}
              className="group relative rounded-custom px-3 py-2"
            >
              {hoverId === item.label ? (
                <m.span
                  key={item.label}
                  layoutId="global-search-links"
                  transition={{
                    duration: 0.3,
                    bounce: 0,
                    type: "spring"
                  }}
                  className="absolute inset-0 rounded-custom bg-secondary transition-colors"
                />
              ) : null}
              <span className="flex items-center space-x-1.5">
                <Icon className="opacity-50 transition-opacity group-hover:opacity-100" />
                <span className="relative transition-colors group-hover:text-primary">
                  {item.label}
                </span>
              </span>
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export const Search = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  console.info("🚀 ~ Search ~ debouncedSearchTerm:", debouncedSearchTerm);

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="p-2 font-medium backdrop-blur-3xl lg:w-[444px]"
        >
          <span className="inline-flex items-center gap-1.5">
            <MagnifyingGlass className="size-4" />
            <span className="hidden lg:inline-block">Search for a tape</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
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
        <ScrollArea className="h-96">
          <div className="p-2 text-primary/80">
            <h6 className="flex h-8 items-center px-3 font-medium text-xs">
              Suggestions
            </h6>
            <List
              onNavigate={() => {
                setOpen(false);
                setSearchTerm("");
              }}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

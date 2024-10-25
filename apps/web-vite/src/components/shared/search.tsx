import { Link } from "@tanstack/react-router";
import {
  Button,
  CassetteTape,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  MagnifyingGlass,
  User
} from "@tape.xyz/winder";

export const Search = () => {
  return (
    <Dialog>
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
      <DialogContent className="h-96">
        <DialogHeader>
          <DialogTitle>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-muted">
                <MagnifyingGlass className="size-4" />
              </span>
              <input
                className="w-full border-custom border-b bg-transparent px-10 py-4 font-normal text-sm outline-none"
                placeholder="Type to search tape"
              />
            </div>
          </DialogTitle>
          <div className="p-2 text-primary/80">
            <h6 className="flex h-8 items-center px-3 font-medium text-xs">
              Suggestions
            </h6>
            <ul className="text-sm">
              {["sasicodes", "tape"].map((item) => (
                <Link
                  key={item}
                  to="/u/$handle"
                  params={{ handle: item }}
                  search={{ media: "videos" }}
                >
                  <li className="group flex items-center space-x-1.5 rounded-custom px-3 py-2 transition-colors hover:bg-secondary hover:text-primary">
                    <User className="opacity-50 transition-colors group-hover:opacity-100" />
                    <span>@{item}</span>
                  </li>
                </Link>
              ))}
              {[
                "Debugging React is fun 🤡",
                "Just resolved a merge conflict of 400 files 😵‍💫"
              ].map((item) => (
                <Link
                  key={item}
                  to="/watch/$pubId"
                  params={{ pubId: "0x2d-0x022f-DA-7918bc14" }}
                >
                  <li className="group flex items-center space-x-1.5 rounded-custom px-3 py-2 transition-colors hover:bg-secondary hover:text-primary">
                    <CassetteTape className="opacity-50 transition-colors group-hover:opacity-100" />
                    <span>{item}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  MagnifyingGlass
} from "@tape.xyz/winder";
import { useState } from "react";
import { SearchInput } from "./input";

export const SearchTrigger = () => {
  const [open, setOpen] = useState(false);

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
        <SearchInput onNavigate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

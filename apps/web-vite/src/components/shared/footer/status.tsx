import { TAPE_STATUS_PAGE } from "@tape.xyz/constants";
import { Button } from "@tape.xyz/winder";

export const Status = () => {
  return (
    <a href={TAPE_STATUS_PAGE} target="_blank" rel="noreferrer">
      <Button variant="outline">
        <span className="flex items-center space-x-[10px]">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2A59FF]" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#2A59FF]" />
          </span>
          <span>All systems normal</span>
        </span>
      </Button>
    </a>
  );
};

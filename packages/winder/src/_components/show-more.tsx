import { useState } from "react";
import { CaretDown } from "../icons";
import { tw } from "../tw";
import { Button } from "./button";

const MButton = ({ onToggle }: { onToggle: (on: boolean) => void }) => {
  const [on, toggle] = useState(false);

  return (
    <Button
      size="xs"
      variant="secondary"
      className="rounded-full"
      onClick={() => {
        toggle(!on);
        onToggle(!on);
      }}
    >
      <span className="inline-flex items-center space-x-0.5">
        <span>Show {on ? "less" : "more"}</span>
        <CaretDown className={tw(on && "rotate-180")} weight="bold" />
      </span>
    </Button>
  );
};

export const ShowMore = ({ onToggle }: { onToggle: (on: boolean) => void }) => {
  return (
    <div className="flex items-center">
      <div className="h-[1px] flex-1 bg-secondary" />
      <MButton onToggle={onToggle} />
      <div className="h-[1px] flex-1 bg-secondary" />
    </div>
  );
};

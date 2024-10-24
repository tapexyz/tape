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

type ShowMoreProps = {
  onToggle: (on: boolean) => void;
  className?: string;
};

export const ShowMore = ({ onToggle, className }: ShowMoreProps) => {
  return (
    <div className={tw("flex items-center", className)}>
      <div className="h-[1px] flex-1 bg-secondary" />
      <MButton onToggle={onToggle} />
      <div className="h-[1px] flex-1 bg-secondary" />
    </div>
  );
};

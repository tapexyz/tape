import { useState } from "react";
import { CaretDown } from "../icons";
import { tw } from "../tw";
import { Button } from "./button";

type Props = {
  onToggle: (on: boolean) => void;
  className?: string;
  content?: React.ReactNode;
};

const MButton = ({ onToggle, content }: Props) => {
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
      <span className="inline-flex items-center">
        {content ?? <span>Show {on ? "less" : "more"}</span>}
        <CaretDown className={tw("ml-1", on && "rotate-180")} weight="bold" />
      </span>
    </Button>
  );
};

export const ShowMore = ({ onToggle, className, content }: Props) => {
  return (
    <div className={tw("flex items-center", className)}>
      <div className="h-px flex-1 bg-secondary" />
      <MButton onToggle={onToggle} content={content} />
      <div className="h-px flex-1 bg-secondary" />
    </div>
  );
};

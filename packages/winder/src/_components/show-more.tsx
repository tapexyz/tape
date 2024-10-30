import { useState } from "react";
import { CaretDown } from "../icons";
import { tw } from "../tw";
import { Button } from "./button";

const MButton = ({
  onToggle,
  content
}: {
  onToggle: (on: boolean) => void;
  content?: React.ReactNode;
}) => {
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
        <CaretDown className={tw("ml-0.5", on && "rotate-180")} weight="bold" />
      </span>
    </Button>
  );
};

type ShowMoreProps = {
  onToggle: (on: boolean) => void;
  className?: string;
  content?: React.ReactNode;
};

export const ShowMore = ({ onToggle, className, content }: ShowMoreProps) => {
  return (
    <div className={tw("flex items-center", className)}>
      <div className="h-px flex-1 bg-secondary" />
      <MButton onToggle={onToggle} content={content} />
      <div className="h-px flex-1 bg-secondary" />
    </div>
  );
};

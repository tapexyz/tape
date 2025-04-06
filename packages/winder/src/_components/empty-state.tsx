import type { Icon } from "@phosphor-icons/react";
import {
  Database,
  Empty,
  Island,
  Placeholder,
  SmileyXEyes,
  TriangleDashed
} from "../icons";
import { tw } from "../tw";

type Props = {
  title: string;
  description?: string;
  more?: React.ReactNode;
  className?: string;
};

const emptyIcons = [
  TriangleDashed,
  Empty,
  Placeholder,
  Database,
  SmileyXEyes,
  Island
];
const RandomIcon = emptyIcons[
  Math.floor(Math.random() * emptyIcons.length)
] as Icon;

export const EmptyState = ({ title, description, more, className }: Props) => {
  return (
    <div className={tw("grid place-items-center", className)}>
      <div className="flex max-w-xs flex-col items-center gap-4 text-center">
        <RandomIcon className="size-10 opacity-60" />
        <div className="flex flex-col gap-2">
          <span className="text-primary/80">{title}</span>
          {description ? (
            <span className="text-muted text-sm">{description}</span>
          ) : null}
        </div>
        {more}
      </div>
    </div>
  );
};

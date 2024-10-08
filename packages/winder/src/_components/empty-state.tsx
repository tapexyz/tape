import { TriangleDashed } from "../icons";

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export const EmptyState = ({ title, description, action }: Props) => {
  return (
    <div className="grid place-items-center">
      <div className="flex max-w-xs flex-col items-center gap-4 text-center">
        <TriangleDashed className="size-10 opacity-70" />
        <div className="flex flex-col gap-2">
          <span>{title}</span>
          {description ? (
            <span className="text-muted text-sm">{description}</span>
          ) : null}
        </div>
        {action}
      </div>
    </div>
  );
};

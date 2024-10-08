import { tw } from "../tw";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ children, className }: Props) => {
  return (
    <div
      className={tw(
        "relative grid place-items-center rounded-card bg-card p-6",
        className
      )}
    >
      {children}
    </div>
  );
};

import React, { FC, ReactNode } from "react";

interface Props {
  message: ReactNode;
}

export const EmptyState: FC<Props> = ({ message }) => {
  return (
    <div className="border-0">
      <div className="grid p-5 space-y-2 justify-items-center">
        <div>{message}</div>
      </div>
    </div>
  );
};

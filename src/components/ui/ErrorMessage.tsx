import React, { FC } from "react";

interface Props {
  error?: Error;
  className?: string;
}

export const ErrorMessage: FC<Props> = ({ error, className = "" }) => {
  if (!error) return null;

  return (
    <div className={`p-1 space-y-1 rounded-lg ${className}`}>
      <div className="text-xs font-semibold text-red-500">{error?.message}</div>
    </div>
  );
};

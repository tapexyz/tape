import clsx from "clsx";
import { FC } from "react";

type Props = {
  label: string;
  className: string;
  validationError: string;
};

export const TextArea: FC<Props> = ({
  label,
  validationError,
  className = "",
  ...props
}) => {
  return (
    <label className="w-full">
      {label && (
        <div className="flex items-center mb-1 space-x-1.5">
          <div className="text-[11px] font-semibold uppercase opacity-70">
            {label}
          </div>
        </div>
      )}
      <div className="flex">
        <textarea
          className={clsx(
            { "!border-red-500": validationError?.length },
            "bg-white text-sm px-2.5 py-1.5 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full",
            className
          )}
          {...props}
        />
      </div>
      {validationError && (
        <div className="mx-1 mt-1 text-sm text-red-500">{validationError}</div>
      )}
    </label>
  );
};

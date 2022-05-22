import clsx from "clsx";
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactNode,
} from "react";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: "sm" | "md" | "lg";
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "super"
    | "danger";
  outline?: "none" | "danger" | "primary";
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className = "",
    size = "sm",
    variant = "primary",
    outline = "",
    loading,
    icon,
    children,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(
        {
          "bg-secondary dark:bg-gray-800 border border-gray-100 dark:border-gray-800":
            outline !== "none" && variant === "primary",
          "!bg-transparent": outline === "primary",
          "px-3 py-1 text-sm": size === "sm",
          "px-3 py-1.5 text-base": size === "md",
          "px-4 py-2 text-lg": size === "lg",
        },
        "rounded-lg disabled:opacity-50 outline-none inline-flex items-center",
        className
      )}
      disabled={loading}
      {...rest}
    >
      {icon}
      <div>{children}</div>
    </button>
  );
});

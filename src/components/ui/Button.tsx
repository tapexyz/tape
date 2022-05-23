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
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  children?: ReactNode;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className = "",
    size = "sm",
    variant = "primary",
    loading,
    children,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(
        "relative inline-block disabled:opacity-50 rounded-md group",
        {
          "px-4 py-1.5 text-xs": size === "sm",
          "px-5 py-1.5 text-sm": size === "md",
          "px-6 py-2 text-base": size === "lg",
        },
        className
      )}
      disabled={loading}
      {...rest}
    >
      <span
        className={clsx(
          "absolute focus:outline-none inset-0 w-full h-full transition duration-200 ease-in-out transform rounded-md group-hover:translate-x-0.5 group-hover:translate-y-0.5",
          {
            "dark:border border-green-900 bg-green-900": variant === "primary",
            "bg-transparent": variant === "secondary",
            "border-red-500 border": variant === "danger",
          }
        )}
      ></span>
      <span
        className={clsx("absolute inset-0 w-full h-full rounded-md", {
          "bg-white dark:bg-black border border-green-900":
            variant === "primary",
          "bg-transparent": variant === "secondary",
          "bg-red-500 border border-red-500": variant === "danger",
        })}
      ></span>
      <span className="relative text-black dark:text-white">{children}</span>
    </button>
  );
});

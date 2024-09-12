import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { tw } from "@tape.xyz/browser";
import type { ElementRef, FC, ReactNode } from "react";
import type React from "react";
import { forwardRef } from "react";

export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
export const DropdownMenuContent = DropdownMenuPrimitive.Content;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

type DropdownMenuSubContentProps =
  DropdownMenuPrimitive.DropdownMenuSubContentProps & {
    children?: ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg";
  };
export const DropdownMenuSubContent: React.ForwardRefExoticComponent<
  DropdownMenuSubContentProps &
    React.RefAttributes<HTMLElement | SVGElement | React.Component | null>
> = forwardRef<
  HTMLElement | SVGElement | React.Component | null,
  DropdownMenuSubContentProps
>(({ children, className, size = "sm", ...props }, ref) => {
  const sizeClasses = {
    "p-2 text-sm": size === "sm",
    "p-3 text-sm": size === "md",
    "px-8 py-4 text-base": size === "lg",
  };
  return (
    <DropdownMenuPrimitive.SubContent
      sideOffset={5}
      className={tw(
        sizeClasses,
        "tape-border z-10 rounded-md bg-white leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:outline-none dark:bg-black dark:data-[highlighted]:bg-gray-800",
        className,
      )}
      ref={ref as React.Ref<HTMLDivElement>}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.SubContent>
  );
});
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

type DropdownMenuSubTriggerProps =
  DropdownMenuPrimitive.DropdownMenuSubTriggerProps & {
    children?: ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg";
  };
export const DropdownMenuSubTrigger: React.ForwardRefExoticComponent<
  DropdownMenuSubTriggerProps &
    React.RefAttributes<HTMLElement | SVGElement | React.Component | null>
> = forwardRef<
  HTMLElement | SVGElement | React.Component | null,
  DropdownMenuSubTriggerProps
>(({ children, className, size = "sm", ...props }, ref) => {
  const sizeClasses = {
    "px-4 py-2 text-sm": size === "sm",
    "px-6 py-3 text-sm": size === "md",
    "px-8 py-4 text-base": size === "lg",
  };
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={tw(
        sizeClasses,
        "relative select-none items-center rounded-md leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:outline-none dark:data-[highlighted]:bg-gray-800",
        className,
      )}
      ref={ref as React.Ref<HTMLDivElement>}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

type DropdownMenuItemProps = DropdownMenuPrimitive.DropdownMenuItemProps & {
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
};
export const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ children, className, size = "sm", ...props }, ref) => {
  const sizeClasses = {
    "px-4 py-2 text-sm": size === "sm",
    "px-6 py-3 text-sm": size === "md",
    "px-8 py-4 text-base": size === "lg",
  };

  return (
    <DropdownMenuPrimitive.Item
      className={tw(
        sizeClasses,
        "relative select-none items-center space-x-2 rounded-md leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:outline-none dark:hover:bg-gray-800 dark:data-[highlighted]:bg-gray-800",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

type DropdownMenuProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
};

export const DropdownMenu: FC<DropdownMenuProps> = ({
  trigger,
  children,
  align = "end",
}) => {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger className="outline-none">
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          sideOffset={12}
          align={align}
          className="tape-border z-10 rounded-xl bg-white p-2 shadow dark:bg-black"
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuPrimitive.Root>
  );
};

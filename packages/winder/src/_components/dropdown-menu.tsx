import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { forwardRef } from "react";
import { CaretRight } from "../icons";
import { tw } from "../tw";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuSubTrigger = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={tw(
      "flex cursor-default select-none items-center rounded-md px-2.5 py-1.5 text-sm outline-none focus:bg-secondary data-[state=open]:bg-secondary",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <CaretRight className="ml-auto size-3.5" />
  </DropdownMenuPrimitive.SubTrigger>
));

const DropdownMenuSubContent = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    sideOffset={sideOffset}
    className={tw(
      "data-[side=bottom]:slide-in-from-top-2",
      "data-[state=closed]:fade-out data-[state=open]:fade-in",
      "data-[state=closed]:zoom-out-90 data-[state=open]:zoom-in-90",
      "data-[align=start]:data-[state=closed]:slide-out-to-left-2 data-[align=start]:data-[state=open]:slide-in-from-left-2",
      "data-[align=center]:data-[state=closed]:slide-out-to-top-2 data-[align=center]:data-[state=open]:slide-in-from-top-2",
      "data-[align=end]:data-[state=closed]:slide-out-to-right-2 data-[align=end]:data-[state=open]:slide-in-from-right-2",
      "z-50 min-w-[8rem] overflow-hidden rounded-custom border border-strong bg-theme p-1 shadow-custom dark:bg-site",
      className
    )}
    {...props}
  />
));

const DropdownMenuContent = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={tw(
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[state=closed]:fade-out data-[state=open]:fade-in",
        "data-[state=closed]:zoom-out-90 data-[state=open]:zoom-in-90",
        "data-[align=start]:data-[state=closed]:slide-out-to-left-2 data-[align=start]:data-[state=open]:slide-in-from-left-2",
        "data-[align=center]:data-[state=closed]:slide-out-to-top-2 data-[align=center]:data-[state=open]:slide-in-from-top-2",
        "data-[align=end]:data-[state=closed]:slide-out-to-right-2 data-[align=end]:data-[state=open]:slide-in-from-right-2",
        "z-50 min-w-[8rem] overflow-hidden rounded-custom border border-strong bg-theme p-1 shadow-custom dark:bg-site",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

const DropdownMenuItem = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    asDialogTrigger?: boolean;
  }
>(({ className, inset, asDialogTrigger, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={tw(
      "relative flex cursor-pointer select-none items-center rounded-md px-2.5 py-1.5 text-sm transition-colors focus:bg-secondary focus:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...(asDialogTrigger && { onSelect: (evt) => evt.preventDefault() })}
    {...props}
  />
));

const DropdownMenuLabel = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={tw(
      "px-2 py-1.5 font-semibold text-sm",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));

const DropdownMenuSeparator = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={tw("-mx-1 my-1 h-px bg-secondary", className)}
    {...props}
  />
));

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
};

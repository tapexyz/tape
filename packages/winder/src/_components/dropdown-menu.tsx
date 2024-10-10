import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { forwardRef } from "react";
import { CaretRight, Check, DotOutline } from "../icons";
import { tw } from "../tw";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={tw(
      "flex cursor-default select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none focus:bg-site data-[state=open]:bg-site",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <CaretRight className="ml-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
));

const DropdownMenuSubContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    sideOffset={6}
    className={tw(
      "z-50 min-w-[8rem] overflow-hidden rounded-card-sm border-2 border-custom bg-card p-1",
      "data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:zoom-out-90 data-[state=open]:zoom-in-90 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=open]:animate-in",
      className
    )}
    {...props}
  />
));

const DropdownMenuContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={tw(
        "z-50 min-w-[8rem] overflow-hidden rounded-card-sm border-2 border-custom bg-card p-1",
        "data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:zoom-out-90 data-[state=open]:zoom-in-90 data-[state=closed]:animate-out data-[state=open]:animate-in",
        "data-[side=bottom]:slide-in-from-top-4 data-[side=left]:slide-in-from-right-4 data-[side=right]:slide-in-from-left-4 data-[side=top]:slide-in-from-bottom-4 data-[side=left]:slide-out-to-right-4 data-[side=right]:slide-out-to-left-4 data-[side=top]:slide-out-to-bottom-4 data-[side=bottom]:slide-out-to-top-4",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

const DropdownMenuItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    asDialogTrigger?: boolean;
  }
>(({ className, inset, asDialogTrigger, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={tw(
      "relative flex cursor-default select-none items-center rounded-lg px-2 py-1.5 text-sm transition-colors focus:bg-site focus:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...(asDialogTrigger && { onSelect: (evt) => evt.preventDefault() })}
    {...props}
  />
));

const DropdownMenuCheckboxItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={tw(
      "relative flex cursor-default select-none items-center rounded-lg py-1.5 pr-12 pl-4 text-sm transition-colors focus:bg-site focus:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    {children}

    <span className="absolute right-2 flex size-2 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
  </DropdownMenuPrimitive.CheckboxItem>
));

const DropdownMenuRadioItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={tw(
      "relative flex cursor-default select-none items-center rounded-lg py-1.5 pr-2 pl-8 text-sm transition-colors focus:bg-site focus:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <DotOutline className="size-4" weight="fill" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

const DropdownMenuLabel = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
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
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={tw("-mx-1 my-1 h-px bg-site", className)}
    {...props}
  />
));

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup
};

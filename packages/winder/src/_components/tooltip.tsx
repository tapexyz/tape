import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef } from "react";
import { tw } from "../tw";

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipTrigger = TooltipPrimitive.Trigger;

const Tooltip = ({
  delayDuration = 100,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) => (
  <TooltipProvider>
    <TooltipPrimitive.Root delayDuration={delayDuration} {...props} />
  </TooltipProvider>
);

const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={tw(
      "z-50 overflow-hidden rounded-custom bg-primary px-3 py-1.5 text-theme text-xs",
      "fade-in zoom-in-90 data-[state=closed]:fade-out data-[state=closed]:zoom-out-90 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 animate-in data-[state=closed]:animate-out",
      className
    )}
    asChild
    {...props}
  />
));

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

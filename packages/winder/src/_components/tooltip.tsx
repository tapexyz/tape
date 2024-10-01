import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import { forwardRef } from "react";
import { tw } from "../tw";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={tw(
      "z-50 overflow-hidden rounded-custom bg-primary px-3 py-1.5 text-current text-xs",
      className
    )}
    asChild
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 7 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 7 }}
      transition={{ duration: 0.2, type: "spring", bounce: 0.2 }}
    >
      {props.children}
    </motion.div>
  </TooltipPrimitive.Content>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

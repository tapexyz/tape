import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef } from "react";
import { tw } from "../tw";

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={tw("inline-flex items-center gap-3.5", className)}
    {...props}
  />
));

const TabsTrigger = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={tw(
      "inline-flex items-center justify-center whitespace-nowrap underline-offset-2 transition-colors disabled:pointer-events-none disabled:opacity-50 data-[state=inactive]:text-muted data-[state=active]:underline",
      className
    )}
    {...props}
  />
));

const TabsContent = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={tw(className)} {...props} />
));

export { Tabs, TabsList, TabsTrigger, TabsContent };

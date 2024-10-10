import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef } from "react";
import { tw } from "../tw";

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={tw("inline-flex h-10 items-center gap-4 p-1", className)}
    {...props}
  />
));

const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={tw(
      "inline-flex items-center justify-center whitespace-nowrap py-1.5 underline-offset-4 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:underline",
      className
    )}
    {...props}
  />
));

const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={tw("mt-2", className)}
    {...props}
  />
));

export { Tabs, TabsList, TabsTrigger, TabsContent };

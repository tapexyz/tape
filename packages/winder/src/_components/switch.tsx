import * as SwitchPrimitives from "@radix-ui/react-switch";
import { forwardRef, useId } from "react";
import { tw } from "../tw";

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: string;
}

const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, label, ...props }, ref) => {
  const id = useId();

  return (
    <div className="flex items-center space-x-2.5">
      <SwitchPrimitives.Root
        className={tw(
          "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary",
          className
        )}
        id={id}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={tw(
            "pointer-events-none block h-4 w-4 rounded-full bg-theme ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
          )}
        />
      </SwitchPrimitives.Root>
      <label className="select-none leading-none" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});

export { Switch };

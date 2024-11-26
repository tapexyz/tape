import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";
import { tw } from "../tw";

const alertVariants = cva(
  "flex rounded-custom px-4 py-3 relative text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-white",
        destructive: "bg-destructive/10 border border-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const Alert = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={tw(alertVariants({ variant }), className)}
    {...props}
  />
));

import { type VariantProps, cva } from "class-variance-authority";
import { AnimatePresence, m } from "framer-motion";
import { type ButtonHTMLAttributes, forwardRef, memo } from "react";
import { tw } from "../tw";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "flex items-center justify-center relative hover:shadow-inner transition-shadow disabled:pointer-events-none overflow-hidden rounded-custom font-semibold text-sm shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-theme hover:bg-primary/85 disabled:bg-primary/60",
        secondary:
          "bg-secondary backdrop-blur-3xl text-primary border-custom border disabled:bg-primary/[0.05]",
        outline: "border-custom border disabled:opacity-80",
        destructive:
          "bg-destructive text-white hover:bg-destructive/85 disabled:bg-destructive/60"
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-6 px-2.5 text-xs rounded-md",
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-3",
        lg: "h-10 px-8",
        xl: "h-12 px-8",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, ...props }, ref) => {
      return (
        <button
          ref={ref}
          className={tw(buttonVariants({ variant, size, className }))}
          disabled={loading}
          {...props}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <m.span
              className="inline-flex flex-1 items-center justify-center space-x-1 whitespace-nowrap"
              key={loading ? "loading" : "idle"}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25, transition: { duration: 0.1 } }}
            >
              {loading ? <Spinner /> : props.children}
            </m.span>
          </AnimatePresence>
        </button>
      );
    }
  )
);

export { Button };

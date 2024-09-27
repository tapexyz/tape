import { type VariantProps, cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { tw } from "../tw";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "flex items-center justify-center disabled:opacity-80 disabled:pointer-events-none overflow-hidden rounded-rounded h-[34px] font-medium text-sm",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/90"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9"
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
  label: string;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, label, loading, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={tw(buttonVariants({ variant, size, className }))}
        disabled={loading}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            key={loading ? "loading" : "idle"}
          >
            {loading ? <Spinner /> : label}
          </motion.span>
        </AnimatePresence>
      </button>
    );
  }
);

export { Button };

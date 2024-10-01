import { type VariantProps, cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { tw } from "../tw";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "flex items-center justify-center hover:shadow-inner disabled:pointer-events-none overflow-hidden rounded-custom font-medium text-sm",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-current hover:bg-primary/85 disabled:bg-primary/60",
        secondary:
          "bg-secondary text-primary border-custom border disabled:bg-primary/[0.05]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/85 disabled:bg-destructive/60"
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-6 px-2.5 text-xs",
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={tw(buttonVariants({ variant, size, className }))}
        disabled={loading}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            className="inline-flex space-x-1"
            key={loading ? "loading" : "idle"}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
          >
            {loading ? <Spinner /> : props.children}
          </motion.span>
        </AnimatePresence>
      </button>
    );
  }
);

export { Button };

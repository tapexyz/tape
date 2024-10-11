import { type VariantProps, cva } from "class-variance-authority";
import { tw } from "../tw";

const badgeVariants = cva(
  "inline-flex items-center rounded-card px-3 outline-none font-medium tabular-nums py-1 text-xs transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-current",
        secondary: "text-primary bg-primary/5",
        outline: "text-primary border border-custom",
        inverted: "bg-white dark:bg-black text-primary",
        fancy: "bg-upbyte text-current"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const Badge = ({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>) => {
  return (
    <span className={tw(badgeVariants({ variant }), className)} {...props} />
  );
};

export { Badge };

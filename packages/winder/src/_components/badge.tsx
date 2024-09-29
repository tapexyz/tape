import { type VariantProps, cva } from "class-variance-authority";
import { tw } from "../tw";

const badgeVariants = cva(
  "inline-flex items-center rounded-card px-3 font-medium tabular-nums py-1 text-xs transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary",
        secondary: "text-secondary bg-primary/5",
        outline: "text-secondary border border-custom",
        inverted: "bg-primary text-primary invert",
        fancy: "bg-upbyte text-primary"
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

import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";
import { tw } from "../tw";

const buttonVariants = cva("relative flex shrink-0 overflow-hidden", {
  variants: {
    shape: {
      square: "rounded-custom",
      circle: "rounded-full"
    },
    size: {
      xs: "size-[26px]",
      sm: "size-[30px]",
      md: "size-[34px]",
      lg: "size-[38px]",
      xl: "size-14",
      "2xl": "size-[74px]",
      "3xl": "size-[130px]"
    }
  },
  defaultVariants: {
    shape: "square",
    size: "lg"
  }
});

const Avatar = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof buttonVariants>
>(({ className, shape, size, ...props }, ref) => (
  <span
    ref={ref}
    className={tw(buttonVariants({ shape, size, className }))}
    {...props}
  />
));

const AvatarImage = forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={tw("aspect-square h-full w-full object-cover", className)}
    {...props}
    draggable={false}
    alt={props.alt}
  />
));

export { Avatar, AvatarImage };

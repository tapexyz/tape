import type { LinkProps } from "next/link";
import Link from "next/link";
import { type PropsWithChildren, type Ref, forwardRef } from "react";

export const TapeLink = forwardRef(
  (
    props: PropsWithChildren<LinkProps> & { className?: string },
    ref: Ref<HTMLAnchorElement>
  ) => {
    return (
      <Link ref={ref} prefetch={false} {...props}>
        {props.children}
      </Link>
    );
  }
);

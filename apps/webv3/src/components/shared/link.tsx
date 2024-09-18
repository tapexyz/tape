import type { LinkProps } from "next/link";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export const TapeLink = <T extends string | Record<string, any>>(
  props: LinkProps<T> & PropsWithChildren
) => (
  <Link prefetch={false} {...props}>
    {props.children}
  </Link>
);

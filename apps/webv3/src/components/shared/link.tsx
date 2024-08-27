import type { LinkProps } from 'next/link'
import Link from 'next/link'

export const TapeLink = <T extends string | Record<string, any>>(
  props: LinkProps<T>
) => <Link prefetch={false} {...props} />

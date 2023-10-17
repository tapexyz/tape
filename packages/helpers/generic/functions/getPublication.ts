import type { AnyPublication, PrimaryPublication } from '@tape.xyz/lens'

export type Typename<T = string> = { [key in '__typename']?: T }

export type PickByTypename<
  T extends Typename,
  P extends T['__typename'] | undefined
> = T extends {
  __typename?: P
}
  ? T
  : never

export const isMirrorPublication = <T extends AnyPublication>(
  publication: T
): publication is PickByTypename<T, 'Mirror'> =>
  publication.__typename === 'Mirror'

export const getPublication = (
  publication: AnyPublication
): PrimaryPublication => {
  if (!publication) {
    return publication
  }
  const isMirror = isMirrorPublication(publication)

  return isMirror ? publication?.mirrorOn : publication
}

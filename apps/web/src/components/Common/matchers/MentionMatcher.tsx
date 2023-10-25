import { COMMON_REGEX, STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import { Matcher } from 'interweave'
import Link from 'next/link'
import React from 'react'

import type { MentionProps } from './utils'

const ProfileLink = ({ ...props }: any) => {
  return (
    <Link
      href={`/u/${props.display?.slice(1)}`}
      className="inline-flex items-center space-x-1 rounded-full bg-gray-200 px-2 text-sm font-medium dark:bg-gray-800"
    >
      <img
        src={`${STATIC_ASSETS}/brand/logo.svg`}
        className="h-4 w-4"
        draggable={false}
        alt={TAPE_APP_NAME}
      />
      <span className="-mt-[1px]">{props.display.replace('@', '')}</span>
    </Link>
  )
}

export class MentionMatcher extends Matcher<MentionProps> {
  replaceWith(match: string, props: MentionProps) {
    return React.createElement(ProfileLink, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(
      value,
      COMMON_REGEX.MENTION_MATCHER_REGEX,
      (matches) => {
        return {
          display: matches[0]
        }
      }
    )
  }
}

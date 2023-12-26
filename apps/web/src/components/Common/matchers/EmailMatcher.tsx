import type { ChildrenNode, MatchResponse, Node } from 'interweave'
import { Matcher } from 'interweave'
import Link from 'next/link'
import React from 'react'

import type { EmailProps } from './utils'
import { EMAIL_PATTERN } from './utils'

export type EmailMatch = Pick<EmailProps, 'email' | 'emailParts'>

const Email = ({ children, email, ...props }: EmailProps) => {
  return (
    <Link {...props} href={`mailto:${email}`} target="_blank">
      {children}
    </Link>
  )
}

export class EmailMatcher extends Matcher<EmailProps> {
  replaceWith(children: ChildrenNode, props: EmailProps): Node {
    return React.createElement(Email, props, children)
  }

  asTag(): string {
    return 'a'
  }

  match(string: string): MatchResponse<EmailMatch> | null {
    return this.doMatch(string, EMAIL_PATTERN, (matches) => ({
      email: matches[0],
      emailParts: {
        host: matches[2],
        username: matches[1]
      }
    }))
  }
}

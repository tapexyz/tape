import type { ChildrenNode } from 'interweave'

export const EMAIL_USERNAME_PART = /[.a-z0-9!#$%&?*+=_{|}~-]*/

export interface MatcherLinkProps {
  children: React.ReactNode
  href: string
  key?: number | string
  newWindow?: boolean
  onClick?: () => null | void
}
export interface EmailProps extends Partial<MatcherLinkProps> {
  children: ChildrenNode
  email: string
  emailParts: {
    host: string
    username: string
  }
}
export type EmailMatch = Pick<EmailProps, 'email' | 'emailParts'>

export interface CombinePatternsOptions {
  capture?: boolean
  flags?: string
  join?: string
  match?: string
  nonCapture?: boolean
}

export function combinePatterns(
  patterns: RegExp[],
  options: CombinePatternsOptions = {}
) {
  let regex = patterns.map((pattern) => pattern.source).join(options.join ?? '')

  if (options.capture) {
    regex = `(${regex})`
  } else if (options.nonCapture) {
    regex = `(?:${regex})`
  }

  if (options.match) {
    regex += options.match
  }

  return new RegExp(regex, options.flags ?? '')
}

export const VALID_ALNUM_CHARS = /[a-z0-9]/

export const EMAIL_USERNAME = combinePatterns(
  [VALID_ALNUM_CHARS, EMAIL_USERNAME_PART, VALID_ALNUM_CHARS],
  {
    capture: true
  }
)
export const URL_HOST = combinePatterns(
  [
    /(?:(?:[a-z0-9](?:[-a-z0-9_]*[a-z0-9])?)\.)*/, // Subdomain
    /(?:(?:[a-z0-9](?:[-a-z0-9]*[a-z0-9])?)\.)/, // Domain
    /(?:[a-z](?:[-a-z0-9]*[a-z0-9])?)/ // TLD
  ],
  {
    capture: true
  }
)
export const EMAIL_PATTERN = combinePatterns([EMAIL_USERNAME, URL_HOST], {
  flags: 'i',
  join: '@'
})

export interface UrlMatcherOptions {
  customTLDs?: string[]
  validateTLD?: boolean
}

export interface UrlProps extends Partial<MatcherLinkProps> {
  children: ChildrenNode
  url: string
  urlParts: {
    auth: string
    fragment: string
    host: string
    path: string
    port: number | string
    query: string
    scheme: string
  }
}

export const URL_SCHEME = /(https?:\/\/)?/

export const URL_AUTH = combinePatterns(
  [
    /[a-z\u0400-\u04FF0-9\-_~!$&'()*+,;=.:]+/, // Includes colon
    /@/
  ],
  {
    capture: true,
    match: '?'
  }
)

export const URL_PORT = /(?::(\d{1,5}))?/

export const URL_PATH = combinePatterns(
  [
    /\//,
    combinePatterns(
      [
        /[-+a-z0-9!*';:=,.$/%[\]_~@|&]*/,
        /[-+a-z0-9/]/ // Valid ending chars
      ],
      {
        match: '*',
        nonCapture: true
      }
    )
  ],
  {
    capture: true,
    match: '?'
  }
)
export const VALID_PATH_CHARS =
  /(?:[a-zA-Z\u0400-\u04FF0-9\-_~!$&'()[\]\\/*+,;=.%]*)/

export const URL_QUERY = combinePatterns(
  [
    /\?/,
    combinePatterns(
      [
        VALID_PATH_CHARS,
        /[a-z0-9_&=]/ // Valid ending chars
      ],
      {
        match: '?',
        nonCapture: true
      }
    )
  ],
  {
    capture: true,
    match: '?'
  }
)

export const URL_FRAGMENT = combinePatterns(
  [
    /#/,
    combinePatterns(
      [
        VALID_PATH_CHARS,
        /[a-z0-9]/ // Valid ending chars
      ],
      {
        match: '?',
        nonCapture: true
      }
    )
  ],
  {
    capture: true,
    match: '?'
  }
)

export const URL_PATTERN = combinePatterns(
  [URL_SCHEME, URL_AUTH, URL_HOST, URL_PORT, URL_PATH, URL_QUERY, URL_FRAGMENT],
  {
    flags: 'i'
  }
)
export const EMAIL_DISTINCT_PATTERN = new RegExp(
  `^${EMAIL_PATTERN.source}$`,
  EMAIL_PATTERN.flags
)

export interface MentionProps extends Partial<MatcherLinkProps> {
  children: ChildrenNode
  mention: string
  mentionUrl: string | ((hashtag: string) => string)
}

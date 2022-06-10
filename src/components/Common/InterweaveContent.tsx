import { Interweave } from 'interweave'
import { UrlMatcher } from 'interweave-autolink'
import React from 'react'

import { MentionMatcher } from './matchers/MentionMatcher'

const InterweaveContent = ({ content }: { content: string }) => {
  return (
    <span className="interweave-content">
      <Interweave
        content={content}
        newWindow
        matchers={[
          new MentionMatcher('mention'),
          new UrlMatcher('url', { validateTLD: false })
        ]}
      />
    </span>
  )
}

export default InterweaveContent

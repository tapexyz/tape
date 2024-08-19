'use client'

import { Comments } from '@/components/watch/comments'
import { Publication } from '@/components/watch/publication'

export default function WatchPage() {
  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <Publication />
      <p>Comments</p>
      <Comments />
    </div>
  )
}

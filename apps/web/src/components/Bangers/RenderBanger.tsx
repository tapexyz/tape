import type { PrimaryPublication } from '@tape.xyz/lens'
import React from 'react'

const RenderBanger = ({ post }: { post: PrimaryPublication }) => {
  console.log('🚀 ~ file: RenderBanger.tsx:4 ~ RenderBanger ~ post:', post)
  return <div>RenderBanger</div>
}

export default RenderBanger

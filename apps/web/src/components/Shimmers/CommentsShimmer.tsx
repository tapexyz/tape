import CommentOutline from '@components/Common/Icons/CommentOutline'
import React from 'react'

import CommentItemShimmer from './CommentItemShimmer'

const CommentsShimmer = () => {
  return (
    <div>
      <h1 className="m-2 flex items-center space-x-2 pt-2 text-lg">
        <CommentOutline className="h-5 w-5" />
        <span className="font-medium">Comments</span>
      </h1>
      <CommentItemShimmer />
      <CommentItemShimmer />
    </div>
  )
}

export default CommentsShimmer

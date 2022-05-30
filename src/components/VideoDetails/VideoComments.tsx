import { useQuery } from '@apollo/client'
import { Loader } from '@components/ui/Loader'
import { NoDataFound } from '@components/ui/NoDataFound'
import { LENSTUBE_VIDEOS_APP_ID } from '@utils/constants'
import { COMMENT_FEED_QUERY } from '@utils/gql/queries'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { AiOutlineComment } from 'react-icons/ai'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

import Comment from './Comment'

const VideoComments = () => {
  const {
    query: { id }
  } = useRouter()
  const [comments, setComments] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(COMMENT_FEED_QUERY, {
    variables: {
      request: {
        commentsOf: id,
        limit: 10,
        sources: [LENSTUBE_VIDEOS_APP_ID]
      }
    },
    skip: !id,
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setPageInfo(data?.publications?.pageInfo)
      setComments(data?.publications?.items)
    }
  })

  const { observe } = useInView({
    threshold: 0.5,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            commentsOf: id,
            cursor: pageInfo?.next,
            limit: 10,
            sources: [LENSTUBE_VIDEOS_APP_ID]
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.publications?.pageInfo)
        setComments([...comments, ...data?.publications?.items])
      })
    }
  })

  if (loading) return <Loader />

  if (data?.publications?.items.length === 0) {
    return <NoDataFound text="Be the first to comment." />
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="inline-flex items-center my-4 space-x-2 text-lg font-semibold">
          <AiOutlineComment />
          <span>Comments {data?.publications?.pageInfo.totalCount}</span>
        </h1>
      </div>
      {!error && !loading && (
        <>
          <div className="space-y-4">
            {comments?.map((video: LenstubePublication, index: number) => (
              <Comment key={`${video?.id}_${index}`} video={video} hideType />
            ))}
          </div>
          {pageInfo?.next && comments.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default VideoComments

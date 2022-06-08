import { useQuery } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { COMMENT_FEED_QUERY } from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { AiOutlineComment } from 'react-icons/ai'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

import NewComment from './NewComment'

const Comment = dynamic(() => import('./Comment'))

type Props = {
  video: LenstubePublication
}

const VideoComments: FC<Props> = ({ video }) => {
  const {
    query: { id }
  } = useRouter()
  const { selectedChannel } = useAppStore()

  const [comments, setComments] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore, refetch } = useQuery(
    COMMENT_FEED_QUERY,
    {
      variables: {
        request: {
          commentsOf: id,
          limit: 10,
          sources: [LENSTUBE_APP_ID]
        }
      },
      skip: !id,
      fetchPolicy: 'no-cache',
      onCompleted(data) {
        setPageInfo(data?.publications?.pageInfo)
        setComments(data?.publications?.items)
      }
    }
  )

  const refetchComments = () => {
    refetch({
      request: {
        commentsOf: id,
        limit: 10,
        sources: [LENSTUBE_APP_ID]
      }
    })
  }

  const { observe } = useInView({
    threshold: 0.5,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            commentsOf: id,
            cursor: pageInfo?.next,
            limit: 10,
            sources: [LENSTUBE_APP_ID]
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.publications?.pageInfo)
        setComments([...comments, ...data?.publications?.items])
      })
    }
  })

  if (loading) return <Loader />

  return (
    <div className="mb-3">
      {selectedChannel || data?.publications?.pageInfo.totalCount > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="inline-flex items-center my-4 space-x-2 text-lg">
              <AiOutlineComment />
              <span className="font-semibold">Comments</span>
              {data?.publications?.pageInfo.totalCount ? (
                <span className="text-sm font-light">
                  ({data?.publications?.pageInfo.totalCount})
                </span>
              ) : null}
            </h1>
          </div>
          {data?.publications?.items.length === 0 && (
            <NoDataFound text="Be the first to comment." />
          )}
          <NewComment video={video} refetchComments={() => refetchComments()} />
        </>
      ) : null}
      {!error && !loading && (
        <>
          <div className="space-y-4">
            {comments?.map((comment: LenstubePublication, index: number) => (
              <Comment
                key={`${comment?.id}_${index}`}
                comment={comment}
                hideType
              />
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

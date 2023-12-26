import type { AnyPublication } from '@tape.xyz/lens'

import MetaTags from '@components/Common/MetaTags'
import {
  EVENTS,
  getPublication,
  getPublicationData,
  isListenable,
  Tower
} from '@tape.xyz/generic'
import { usePublicationQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import Audio from './Audio'
import Background from './Background'
import Details from './Details'

const Listen = () => {
  const {
    query: { id }
  } = useRouter()

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.LISTEN })
  }, [])

  const { data, error, loading } = usePublicationQuery({
    skip: !id,
    variables: {
      request: { forId: id }
    }
  })

  if (loading || !data) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <Loader />
      </div>
    )
  }

  if (error) {
    return <Custom500 />
  }

  const publication = data?.publication as AnyPublication
  const audio = getPublication(publication)

  if (!isListenable(audio)) {
    return <Custom404 />
  }

  return (
    <>
      <MetaTags
        title={getPublicationData(audio?.metadata)?.title || `Listen`}
      />
      {audio ? (
        <div>
          <Background audio={audio}>
            <Audio audio={audio} />
          </Background>
          <div className="max-w-screen-laptop mx-auto">
            <Details audio={audio} />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Listen

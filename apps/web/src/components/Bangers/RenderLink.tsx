import { CardShimmer } from '@components/Shimmers/VideoCardShimmer'
import { useQuery } from '@tanstack/react-query'
import { WORKER_OEMBED_URL } from '@tape.xyz/constants'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'

const RenderLink = ({ link }: { link: string }) => {
  const fetchOembed = async () => {
    const { data } = await axios.get(WORKER_OEMBED_URL, {
      params: { url: link }
    })
    return data.og
  }

  const {
    isLoading,
    error,
    data: ogData
  } = useQuery({
    queryKey: ['oembed', link],
    queryFn: fetchOembed,
    enabled: Boolean(link)
  })

  if (isLoading || error || !ogData) {
    return <CardShimmer />
  }

  if (!ogData.title) {
    return null
  }

  return ogData?.html ? (
    <div
      className="tape-border rounded-small overflow-hidden"
      dangerouslySetInnerHTML={{ __html: ogData.html as string }}
    />
  ) : (
    <div className="tape-border rounded-small group space-y-2 overflow-hidden">
      <Link
        href={link}
        target={link.includes(location.host) ? '_self' : '_blank'}
        rel="noreferrer noopener"
      >
        <div className="p-4">
          <h1 className="font-medium">{ogData.title}</h1>
          <p className="text-dust text-sm">{ogData.description}</p>
        </div>
        {ogData.image && (
          <img
            src={ogData.image}
            className="rounded-b-small aspect-[16/9]"
            alt="link image"
          />
        )}
      </Link>
    </div>
  )
}

export default RenderLink

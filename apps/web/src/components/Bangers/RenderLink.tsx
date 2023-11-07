import { CardShimmer } from '@components/Shimmers/VideoCardShimmer'
import { useQuery } from '@tanstack/react-query'
import { WORKER_OEMBED_URL } from '@tape.xyz/constants'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'

const RenderLink = ({ link }: { link: string }) => {
  const fetchOembed = async () => {
    const { data } = await axios.get(`${WORKER_OEMBED_URL}/parse`, {
      params: { url: link }
    })
    return data
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
    <div dangerouslySetInnerHTML={{ __html: ogData.html as string }} />
  ) : (
    <Link
      href={link}
      target={link.includes(location.host) ? '_self' : '_blank'}
      rel="noreferrer noopener"
    >
      {link}
    </Link>
  )
}

export default RenderLink

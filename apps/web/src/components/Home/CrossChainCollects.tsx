import CollectOutline from '@components/Common/Icons/CollectOutline'
import { NFTS_URL } from '@lenstube/constants'
import { imageCdn, sanitizeDStorageUrl } from '@lenstube/generic'
import type { CrossChainCollect } from '@lenstube/lens/custom-types'
import { Trans } from '@lingui/macro'
import { useQuery } from '@tanstack/react-query'
import { ThirdwebNftMedia, ThirdwebProvider } from '@thirdweb-dev/react'
import axios from 'axios'
import React from 'react'

const CrossChainCollects = () => {
  const fetchMints = async () => {
    const { data } = await axios.get(`${NFTS_URL}/zora`)
    return data
  }

  const { data, isLoading, error } = useQuery(
    ['CrossChainCollects'],
    () => fetchMints().then((res) => res),
    {
      enabled: true
    }
  )
  const collects = data?.items as CrossChainCollect[]
  console.log(
    '🚀 ~ file: CrossChainMints.tsx:20 ~ CrossChainMints ~ mints:',
    collects
  )

  return (
    <ThirdwebProvider>
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CollectOutline className="h-4 w-4" />
            <h1 className="text-xl font-semibold">
              <Trans>Cross Chain Collects</Trans>
            </h1>
          </div>
        </div>
        <div className="grid gap-x-4 gap-y-2 md:grid-cols-4 md:gap-y-8 lg:grid-cols-5">
          {collects?.map(({ token }: CrossChainCollect, i) => {
            const image = imageCdn(
              sanitizeDStorageUrl(token.image.url),
              'THUMBNAIL'
            )
            return (
              <div
                key={i}
                className="aspect-h-9 relative overflow-hidden rounded-xl"
              >
                <div
                  style={{
                    backgroundImage: `url("${sanitizeDStorageUrl(image)}")`
                  }}
                  className="aspect-h-9 z-0 bg-cover bg-no-repeat blur-xl"
                />
                <ThirdwebNftMedia
                  metadata={token.metadata}
                  requireInteraction={true}
                />
                {/* <div
                  style={{
                    backgroundImage: `url("${sanitizeDStorageUrl(image)}")`
                  }}
                  className="aspect-h-9 aspect-w-16 z-0 bg-cover bg-no-repeat blur-xl"
                />
                <img
                  src={image}
                  className="h-full w-full rounded-xl object-contain object-center lg:h-full lg:w-full"
                  alt="thumbnail"
                  draggable={false}
                  onError={({ currentTarget }) => {
                    currentTarget.src = FALLBACK_COVER_URL
                  }}
                /> */}
              </div>
            )
          })}
        </div>
        <hr className="border-theme my-8 border-opacity-10 dark:border-gray-700" />
      </div>
    </ThirdwebProvider>
  )
}

export default CrossChainCollects

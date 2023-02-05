import { Loader } from '@components/UIElements/Loader'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import type { Nft, Profile } from 'lens'
import { useProfileNfTsQuery } from 'lens'
import type { ChangeEvent, FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'
import { Analytics, POLYGON_CHAIN_ID, STATIC_ASSETS, TRACK } from 'utils'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import { mainnet } from 'wagmi/chains'

type Props = {
  onChooseImage?: (e: ChangeEvent<HTMLInputElement>) => void
  channel: Profile
  setNFTAvatar: (
    contractAddress: string,
    tokenId: string,
    chainId: number
  ) => void
}

const ChoosePicture: FC<Props> = ({ onChooseImage, channel, setNFTAvatar }) => {
  const request = {
    limit: 32,
    chainIds: [POLYGON_CHAIN_ID, mainnet.id],
    ownerAddress: channel.ownedBy
  }

  const { data, loading, error, fetchMore } = useProfileNfTsQuery({
    variables: {
      request
    }
  })

  const collectedNFTs = data?.nfts?.items as Nft[]
  const pageInfo = data?.nfts?.pageInfo

  const { observe } = useInView({
    rootMargin: '10px',
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  return (
    <Tab.Group>
      <Tab.List className="static top-0 flex w-full justify-center">
        <Tab
          onClick={() => Analytics.track(TRACK.PFP.CLICK_UPLOAD_TAB)}
          className={({ selected }) =>
            clsx(
              'w-full border-b-2 py-2 text-sm focus:outline-none',
              selected
                ? 'border-indigo-500 opacity-100'
                : 'border-transparent opacity-50'
            )
          }
        >
          Upload
        </Tab>
        <Tab
          onClick={() => Analytics.track(TRACK.PFP.CLICK_NFTS_TAB)}
          className={({ selected }) =>
            clsx(
              'w-full border-b-2 py-2 text-sm focus:outline-none',
              selected
                ? 'border-indigo-500 opacity-100'
                : 'border-transparent opacity-50'
            )
          }
        >
          NFT's
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className="no-scrollbar no-scrollbar flex h-[40vh] flex-col items-center justify-center py-10 focus:outline-none">
          <label
            htmlFor="choosePfp"
            className="cursor-pointer rounded-full border border-indigo-500 bg-indigo-500 px-8 py-3 text-white"
          >
            Choose image
          </label>
          <input
            id="choosePfp"
            type="file"
            accept=".png, .jpg, .jpeg, .svg, .gif"
            className="hidden w-full"
            onChange={onChooseImage}
          />
        </Tab.Panel>
        <Tab.Panel className="no-scrollbar h-[40vh] overflow-y-auto py-5 focus:outline-none">
          {loading && <Loader />}
          {!error && !loading && (
            <>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-4">
                {collectedNFTs.map((nft: Nft) => {
                  return (
                    <img
                      key={nft.contentURI}
                      src={imageCdn(
                        nft.originalContent?.uri
                          ? sanitizeIpfsUrl(nft.originalContent?.uri)
                          : `${STATIC_ASSETS}/images/placeholder.webp`,
                        'avatar_lg'
                      )}
                      className="h-20 w-20 cursor-pointer rounded-xl md:h-28 md:w-28"
                      alt={nft.name}
                      onClick={() => {
                        Analytics.track(TRACK.PFP.SELECT_NFT)
                        setNFTAvatar(
                          nft.contractAddress,
                          nft.tokenId,
                          nft.chainId
                        )
                      }}
                    />
                  )
                })}
              </div>
              {pageInfo?.next && (
                <span ref={observe} className="mt-5 flex justify-center">
                  <Loader />
                </span>
              )}
            </>
          )}
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

export default ChoosePicture

import { Loader } from '@components/UIElements/Loader'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import type { Nft, Profile } from 'lens'
import { useProfileNfTsQuery } from 'lens'
import type { ChangeEvent, FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'
import { POLYGON_CHAIN_ID, STATIC_ASSETS } from 'utils'
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
      <Tab.List className="flex justify-center static top-0 w-full">
        <Tab
          className={({ selected }) =>
            clsx(
              'py-2 border-b-2 text-sm focus:outline-none w-full',
              selected
                ? 'border-indigo-500 opacity-100'
                : 'border-transparent opacity-50 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-tl-lg rounded-tr-lg'
            )
          }
        >
          Upload
        </Tab>
        <Tab
          className={({ selected }) =>
            clsx(
              'py-2 border-b-2 text-sm focus:outline-none w-full',
              selected
                ? 'border-indigo-500 opacity-100'
                : 'border-transparent opacity-50 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-tl-lg rounded-tr-lg'
            )
          }
        >
          NFT's
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className="h-[60vh] no-scrollbar focus:outline-none flex flex-col justify-center items-center py-10 no-scrollbar">
          <label
            htmlFor="choosePfp"
            className="border border-indigo-500 bg-indigo-500 px-8 py-4 rounded-full text-white cursor-pointer"
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
        <Tab.Panel className="h-[60vh] no-scrollbar overflow-y-auto focus:outline-none py-5">
          {loading && <Loader />}
          {!error && !loading && (
            <>
              <div className="grid grid-cols-3 lg:grid-cols-4 md:grid-cols-4 gap-4">
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
                      className="rounded-xl cursor-pointer h-20 w-20 lg:h-28 lg:w-28 md:h-28 md:w-28"
                      alt={nft.name}
                      onClick={() =>
                        setNFTAvatar(
                          nft.contractAddress,
                          nft.tokenId,
                          nft.chainId
                        )
                      }
                    />
                  )
                })}
              </div>
              {pageInfo?.next &&
                collectedNFTs.length !== pageInfo?.totalCount && (
                  <span ref={observe} className="flex justify-center mt-5">
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

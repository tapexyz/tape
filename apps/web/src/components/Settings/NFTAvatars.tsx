import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import Modal from '@components/UIElements/Modal'
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
  isModalOpen: boolean
  onClose?: () => void
  onPfpUpload?: (e: ChangeEvent<HTMLInputElement>) => void
  channel: Profile
  setNFTAvatar: (
    contractAddress: string,
    tokenId: string,
    chainId: Number
  ) => void
}

const NFTAvatars: FC<Props> = ({
  isModalOpen,
  onClose,
  onPfpUpload,
  channel,
  setNFTAvatar
}) => {
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
    <Modal
      onClose={() => onClose?.()}
      show={isModalOpen}
      panelClassName="max-w-lg h-auto"
      autoClose={false}
    >
      <div className="overflow-y-auto no-scrollbar">
        <Tab.Group>
          <Tab.List className="flex justify-center static top-0 w-full">
            <Tab
              className={({ selected }) =>
                clsx(
                  'py-2 border-b-2 text-sm focus:outline-none w-full',
                  selected
                    ? 'border-indigo-500 opacity-100'
                    : 'border-transparent opacity-50 hover:bg-indigo-500/[0.12]'
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
                    : 'border-transparent opacity-50 hover:bg-indigo-500/[0.12]'
                )
              }
            >
              NFT's
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="no-scrollbar focus:outline-none flex justify-center py-10">
              <label
                htmlFor="choosePfp"
                className="border border-indigo-500 bg-indigo-500 px-5 py-1 rounded-full text-white cursor-pointer"
              >
                Choose image
              </label>
              <input
                id="choosePfp"
                type="file"
                accept=".png, .jpg, .jpeg, .svg, .gif"
                className="hidden w-full"
                onChange={onPfpUpload}
              />
            </Tab.Panel>
            <Tab.Panel className="no-scrollbar max-h-96 overflow-y-auto focus:outline-none py-5">
              {!error && !loading && (
                <>
                  <div className="grid grid-cols-3 gap-5">
                    {collectedNFTs.map((nft: Nft) => {
                      return (
                        <img
                          key={nft.contentURI}
                          src={imageCdn(
                            nft.originalContent?.uri
                              ? sanitizeIpfsUrl(nft.originalContent?.uri)
                              : `${STATIC_ASSETS}/images/placeholder.webp`,
                            'thumbnail'
                          )}
                          className="rounded-xl cursor-pointer"
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
              {loading && <TimelineShimmer />}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Modal>
  )
}

export default NFTAvatars

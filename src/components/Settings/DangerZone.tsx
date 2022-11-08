import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import IsVerified from '@components/Common/IsVerified'
import { Button } from '@components/UIElements/Button'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import { LENSHUB_PROXY_ADDRESS } from '@utils/constants'
import clearLocalStorage from '@utils/functions/clearLocalStorage'
import { formatNumber } from '@utils/functions/formatNumber'
import getProfilePicture from '@utils/functions/getProfilePicture'
import omitKey from '@utils/functions/omitKey'
import { utils } from 'ethers'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Custom404 from 'src/pages/404'
import {
  CreateBurnProfileBroadcastItemResult,
  CreateBurnProfileTypedDataDocument
} from 'src/types/lens'
import { CustomErrorWithData } from 'src/types/local'
import {
  useContractWrite,
  useSignTypedData,
  useWaitForTransaction
} from 'wagmi'

const DangerZone = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [loading, setLoading] = useState(false)
  const [txnHash, setTxnHash] = useState<`0x${string}`>()
  const { signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })

  const onError = (error: CustomErrorWithData) => {
    setLoading(false)
    toast.error(error?.data?.message ?? error?.message)
  }

  const { write: writeDeleteProfile } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'burnWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: (data) => setTxnHash(data.hash)
  })

  useWaitForTransaction({
    enabled: txnHash && txnHash.length > 0,
    hash: txnHash,
    onSuccess() {
      toast.success('Channel deleted')
      setLoading(false)
      clearLocalStorage()
      location.href = '/'
    },
    onError
  })

  const [createBurnProfileTypedData] = useMutation(
    CreateBurnProfileTypedDataDocument,
    {
      async onCompleted(data) {
        const { typedData } =
          data.createBurnProfileTypedData as CreateBurnProfileBroadcastItemResult
        try {
          const signature = await signTypedDataAsync({
            domain: omitKey(typedData?.domain, '__typename'),
            types: omitKey(typedData?.types, '__typename'),
            value: omitKey(typedData?.value, '__typename')
          })
          const { tokenId } = typedData?.value
          const { v, r, s } = utils.splitSignature(signature)
          const sig = { v, r, s, deadline: typedData.value.deadline }
          writeDeleteProfile?.({ recklesslySetUnpreparedArgs: [tokenId, sig] })
        } catch (error) {
          logger.error('[Error Delete Channel Typed Data]', error)
        }
      },
      onError
    }
  )

  const onClickDelete = () => {
    setLoading(true)
    createBurnProfileTypedData({
      variables: {
        request: { profileId: selectedChannel?.id }
      }
    })
  }

  if (!selectedChannel) return <Custom404 />

  return (
    <div className="py-4 bg-white rounded-lg dark:divide-gray-900 dark:bg-black">
      <div className="flex flex-wrap items-center justify-between p-4 mb-5 border dark:border-gray-700 rounded-xl">
        <div className="flex items-center">
          <div className="flex-none mr-3 mt-0.5">
            <img
              src={getProfilePicture(selectedChannel, 'avatar')}
              className="rounded-full w-9 h-9"
              draggable={false}
              alt="pfp"
            />
          </div>
          <div className="flex flex-col">
            {selectedChannel.name && (
              <h6 className="font-medium">{selectedChannel.name}</h6>
            )}
            <span className="flex items-center space-x-1">
              <span className="text-sm">{selectedChannel?.handle}</span>
              <IsVerified id={selectedChannel?.id} size="xs" />
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <span>
            {formatNumber(selectedChannel.stats.totalPosts)}{' '}
            <small>videos</small>
          </span>
          <span>
            {formatNumber(selectedChannel.stats.totalFollowers)}{' '}
            <small>subscribers</small>
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between px-2">
        <div className="mb-4">
          <h1 className="mb-1 text-xl font-semibold">Delete Channel</h1>
          <p className="text-sm opacity-80">
            Delete your channel and its data from Lens.
            <span className="ml-1 text-sm text-red-500">
              It can not be reverted
            </span>
          </p>
        </div>
        <Button
          disabled={loading}
          loading={loading}
          onClick={() => onClickDelete()}
          variant="danger"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export default DangerZone

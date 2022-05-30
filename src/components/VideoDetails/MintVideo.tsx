import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Button } from '@components/ui/Button'
import { Loader } from '@components/ui/Loader'
import Tooltip from '@components/ui/Tooltip'
import { ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS } from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import { CREATE_COLLECT_TYPED_DATA } from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import { utils } from 'ethers'
import React, { FC, useEffect } from 'react'
import toast from 'react-hot-toast'
import { SiOpenmined } from 'react-icons/si'
import { CreateCollectBroadcastItemResult } from 'src/types'
import { LenstubePublication } from 'src/types/local'
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  video: LenstubePublication
}

const MintVideo: FC<Props> = ({ video }) => {
  const { data: accountData } = useAccount()

  const { signTypedDataAsync } = useSignTypedData()
  const { data: writtenData, write: writeCollectWithSig } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY_ADDRESS,
      contractInterface: LENSHUB_PROXY_ABI
    },
    'collectWithSig',
    {
      onError(error: any) {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  )
  const { indexed } = usePendingTxn(writtenData?.hash || '')

  useEffect(() => {
    if (indexed) toast.success('Collected as NFT')
  }, [indexed])

  const [createCollectTypedData, { loading: isLoading }] = useMutation(
    CREATE_COLLECT_TYPED_DATA,
    {
      onCompleted({
        createCollectTypedData
      }: {
        createCollectTypedData: CreateCollectBroadcastItemResult
      }) {
        const { typedData } = createCollectTypedData

        signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        }).then((signature) => {
          const { v, r, s } = utils.splitSignature(signature)
          writeCollectWithSig({
            args: {
              collector: accountData?.address,
              profileId: typedData?.value.profileId,
              pubId: typedData?.value.pubId,
              data: typedData.value.data,
              sig: { v, r, s, deadline: typedData.value.deadline }
            }
          })
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const handleMint = () => {
    createCollectTypedData({
      variables: { request: { publicationId: video?.id } }
    })
  }

  return (
    <div>
      <Tooltip content="Mint as NFT" placement="top">
        <span>
          <Button
            disabled={isLoading}
            onClick={() => handleMint()}
            className="!p-2"
          >
            {isLoading ? <Loader /> : <SiOpenmined />}
          </Button>
        </span>
      </Tooltip>
    </div>
  )
}

export default MintVideo

import { FOLLOW_NFT_ABI } from '@abis/FollowNFT'
import { Button } from '@components/UIElements/Button'
import useAuthPersistStore from '@lib/store/auth'
import { Trans } from '@lingui/macro'
import type { Signer } from 'ethers'
import { ethers, utils } from 'ethers'
import type {
  CreateBurnEip712TypedData,
  CreateUnfollowBroadcastItemResult,
  Profile
} from 'lens'
import { useBroadcastMutation, useCreateUnfollowTypedDataMutation } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED_MESSAGE,
  TRACK
} from 'utils'
import omitKey from 'utils/functions/omitKey'
import { useSigner, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
  onUnSubscribe: () => void
}

const UnSubscribe: FC<Props> = ({ channel, onUnSubscribe }) => {
  const [loading, setLoading] = useState(false)
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message)
    setLoading(false)
  }
  const onCompleted = () => {
    toast.success(`Unsubscribed ${channel.handle}`)
    onUnSubscribe()
    setLoading(false)
    Analytics.track(TRACK.CHANNEL.UNSUBSCRIBE, {
      channel_id: channel.id,
      channel_name: channel.handle
    })
  }

  const { data: signer } = useSigner({ onError })

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const [broadcast] = useBroadcastMutation({
    onCompleted: (data) => {
      if (data?.broadcast?.__typename === 'RelayerResult') {
        onCompleted()
      }
    },
    onError
  })

  const burnWithSig = async (
    signature: string,
    typedData: CreateBurnEip712TypedData
  ) => {
    const { v, r, s } = utils.splitSignature(signature)
    const sig = {
      v,
      r,
      s,
      deadline: typedData.value.deadline
    }
    const followNftContract = new ethers.Contract(
      typedData.domain.verifyingContract,
      FOLLOW_NFT_ABI,
      signer as Signer
    )
    const txn = await followNftContract.burnWithSig(
      typedData?.value.tokenId,
      sig
    )
    if (txn.hash) {
      onCompleted()
    }
  }

  const [createUnsubscribeTypedData] = useCreateUnfollowTypedDataMutation({
    onCompleted: async ({ createUnfollowTypedData }) => {
      const { typedData, id } =
        createUnfollowTypedData as CreateUnfollowBroadcastItemResult
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          await burnWithSig(signature, typedData)
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const unsubscribe = () => {
    if (!selectedChannelId) {
      return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    }
    setLoading(true)
    createUnsubscribeTypedData({
      variables: {
        request: { profile: channel?.id }
      }
    })
  }

  return (
    <Button onClick={() => unsubscribe()} loading={loading}>
      <Trans>Unsubscribe</Trans>
    </Button>
  )
}

export default UnSubscribe

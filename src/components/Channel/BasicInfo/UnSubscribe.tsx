import { FOLLOW_NFT_ABI } from '@abis/FollowNFT'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import logger from '@lib/logger'
import usePersistStore from '@lib/store/persist'
import { SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import { CREATE_UNFOLLOW_TYPED_DATA } from '@utils/gql/queries'
import useTxnToast from '@utils/hooks/useTxnToast'
import { ethers, Signer, utils } from 'ethers'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { CreateUnfollowBroadcastItemResult, Profile } from 'src/types'
import { useSigner, useSignTypedData, useWaitForTransaction } from 'wagmi'

type Props = {
  channel: Profile
  onUnSubscribe: () => void
}

const UnSubscribe: FC<Props> = ({ channel, onUnSubscribe }) => {
  const subscribeType = channel?.followModule?.__typename
  const subscribeText =
    subscribeType === 'FeeFollowModuleSettings'
      ? 'Joined channel'
      : 'Subscribed'
  const [loading, setLoading] = useState(false)
  const [txnHash, setTxnHash] = useState('')
  const [buttonText, setButtonText] = useState(subscribeText)
  const { isAuthenticated } = usePersistStore()
  const { showToast } = useTxnToast()

  const onError = (error?: any) => {
    if (error) toast.error(error?.data?.message ?? error?.message)
    setLoading(false)
    setButtonText(subscribeText)
  }
  const { data: signer } = useSigner({ onError })

  useWaitForTransaction({
    enabled: txnHash.length > 0,
    hash: txnHash,
    onSuccess() {
      toast.success(`Unsubscribed ${channel.handle}`)
      onUnSubscribe()
      setButtonText(
        subscribeType === 'FeeFollowModuleSettings'
          ? 'Join channel'
          : 'Subscribe'
      )
      setLoading(false)
    },
    onError
  })

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const [createUnsubscribeTypedData] = useMutation(CREATE_UNFOLLOW_TYPED_DATA, {
    async onCompleted(data) {
      const { typedData } =
        data.createUnfollowTypedData as CreateUnfollowBroadcastItemResult
      try {
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        const { v, r, s } = utils.splitSignature(signature)
        const sig = {
          v,
          r,
          s,
          deadline: typedData.value.deadline
        }
        // load up the follower nft contract
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
          setTxnHash(txn.hash)
          showToast(txn.hash)
        }
      } catch (error) {
        logger.error('[Error UnSubscribe]', error)
        onError()
      }
    },
    onError
  })

  const unsubscribe = () => {
    if (!isAuthenticated) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setLoading(true)
    setButtonText('Unsubscribing...')
    createUnsubscribeTypedData({
      variables: {
        request: { profile: channel?.id }
      }
    })
  }

  return (
    <Button disabled={loading} onClick={() => unsubscribe()}>
      {buttonText}
    </Button>
  )
}

export default UnSubscribe

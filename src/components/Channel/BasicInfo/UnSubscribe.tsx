import { FOLLOW_NFT_ABI } from '@abis/FollowNFT'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import useAppStore from '@lib/store'
import { ERROR_MESSAGE, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import { CREATE_UNFOLLOW_TYPED_DATA } from '@utils/gql/queries'
import { ethers, Signer, utils } from 'ethers'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { CreateUnfollowBroadcastItemResult, Profile } from 'src/types'
import { useSigner, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
}

const UnSubscribe: FC<Props> = ({ channel }) => {
  const subscribeType = channel?.followModule?.__typename
  const subscribeText =
    subscribeType === 'FeeFollowModuleSettings'
      ? 'Joined channel'
      : 'Subscribed'
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState(subscribeText)
  const { data: signer } = useSigner()
  const { isAuthenticated } = useAppStore()

  const { signTypedDataAsync } = useSignTypedData({
    onError() {
      setLoading(false)
      setButtonText(subscribeText)
    }
  })

  const [createUnsubscribeTypedData] = useMutation(CREATE_UNFOLLOW_TYPED_DATA, {
    onCompleted({
      createUnfollowTypedData
    }: {
      createUnfollowTypedData: CreateUnfollowBroadcastItemResult
    }) {
      const { typedData } = createUnfollowTypedData
      signTypedDataAsync({
        domain: omitKey(typedData?.domain, '__typename'),
        types: omitKey(typedData?.types, '__typename'),
        value: omitKey(typedData?.value, '__typename')
      })
        .then(async (data) => {
          const { v, r, s } = utils.splitSignature(data)
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
            toast.success(`Unsubscribed ${channel.handle}`)
            setButtonText(
              subscribeType === 'FeeFollowModuleSettings'
                ? 'Join channel'
                : 'Subscribe'
            )
          }
          setLoading(false)
        })
        .catch((err) => {
          toast.error(err.message)
          setLoading(false)
          setButtonText(subscribeText)
        })
    },
    onError(error) {
      toast.error(error.message ?? ERROR_MESSAGE)
      setLoading(false)
      setButtonText(subscribeText)
    }
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

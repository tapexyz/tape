import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import logger from '@lib/logger'
import usePersistStore from '@lib/store/persist'
import { LENSHUB_PROXY_ADDRESS, RELAYER_ENABLED } from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import omitKey from '@utils/functions/omitKey'
import { uploadImageToIPFS } from '@utils/functions/uploadToIPFS'
import { BROADCAST_MUTATION, SET_PFP_URI_TYPED_DATA } from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import useTxnToast from '@utils/hooks/useTxnToast'
import clsx from 'clsx'
import { utils } from 'ethers'
import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { RiImageAddLine } from 'react-icons/ri'
import { CreateSetProfileImageUriBroadcastItemResult, Profile } from 'src/types'
import { IPFSUploadResult } from 'src/types/local'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
}

const ChannelPicture: FC<Props> = ({ channel }) => {
  const { selectedChannel, setSelectedChannel } = usePersistStore()
  const [selectedPfp, setSelectedPfp] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useTxnToast()

  const { signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
      setSelectedPfp(getProfilePicture(channel, 'avatar'))
    }
  })
  const { data: pfpData, write: writePfpUri } = useContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: 'setProfileImageURIWithSig',
    onError(error: any) {
      setLoading(false)
      setSelectedPfp(getProfilePicture(channel, 'avatar'))
      toast.error(error?.data?.message || error?.message)
    },
    onSuccess(data) {
      showToast(data.hash)
    }
  })
  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onError(error) {
      toast.error(error?.message)
      setLoading(false)
    },
    onCompleted(data) {
      showToast(data?.broadcast?.txHash)
    }
  })

  const { indexed } = usePendingTxn(
    pfpData?.hash || broadcastData?.broadcast?.txHash
  )

  const onCompleted = () => {
    if (selectedChannel && selectedPfp)
      setSelectedChannel({
        ...selectedChannel,
        picture: { original: { url: selectedPfp } }
      })
  }

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      onCompleted()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createSetProfileImageURITypedData] = useMutation(
    SET_PFP_URI_TYPED_DATA,
    {
      async onCompleted(data) {
        const { typedData, id } =
          data.createSetProfileImageURITypedData as CreateSetProfileImageUriBroadcastItemResult
        try {
          const signature = await signTypedDataAsync({
            domain: omitKey(typedData?.domain, '__typename'),
            types: omitKey(typedData?.types, '__typename'),
            value: omitKey(typedData?.value, '__typename')
          })
          const { profileId, imageURI } = typedData?.value
          const { v, r, s } = utils.splitSignature(signature)
          const args = {
            profileId,
            imageURI,
            sig: { v, r, s, deadline: typedData.value.deadline }
          }
          if (RELAYER_ENABLED) {
            const { data } = await broadcast({
              variables: { request: { id, signature } }
            })
            if (data?.broadcast?.reason) writePfpUri({ args })
          } else {
            writePfpUri({ args })
          }
        } catch (error) {
          setLoading(false)
          setSelectedPfp(getProfilePicture(channel, 'avatar'))
          logger.error('[Error Set Pfp]', error)
        }
      },
      onError(error) {
        setLoading(false)
        setSelectedPfp(getProfilePicture(channel, 'avatar'))
        toast.error(error?.message)
      }
    }
  )

  const onPfpUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        setLoading(true)
        const result: IPFSUploadResult = await uploadImageToIPFS(
          e.target.files[0]
        )
        createSetProfileImageURITypedData({
          variables: {
            request: {
              profileId: selectedChannel?.id,
              url: result.ipfsUrl
            }
          }
        })
        setSelectedPfp(result.ipfsUrl)
      } catch (error) {
        setLoading(false)
        logger.error('[Error Pfp Upload]', error)
      }
    }
  }

  return (
    <div className="relative flex-none overflow-hidden rounded-full group">
      <img
        src={selectedPfp ? selectedPfp : getProfilePicture(channel, 'avatar')}
        className="object-cover w-32 h-32 border-2 rounded-full"
        draggable={false}
        alt="channel picture"
      />
      <label
        className={clsx(
          'absolute top-0 grid w-32 h-32 bg-white rounded-full cursor-pointer bg-opacity-70 place-items-center backdrop-blur-lg invisible group-hover:visible dark:bg-black',
          { '!visible': loading && !pfpData?.hash }
        )}
      >
        {loading && !pfpData?.hash ? (
          <Loader />
        ) : (
          <RiImageAddLine className="text-xl" />
        )}
        <input
          type="file"
          accept=".png, .jpg, .jpeg, .svg"
          className="hidden w-full"
          onChange={onPfpUpload}
        />
      </label>
    </div>
  )
}

export default ChannelPicture

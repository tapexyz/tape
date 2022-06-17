import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import PendingTxnLoader from '@components/Common/PendingTxnLoader'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import { LENSHUB_PROXY_ADDRESS } from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import omitKey from '@utils/functions/omitKey'
import { uploadImageToIPFS } from '@utils/functions/uploadToIPFS'
import { SET_PFP_URI_TYPED_DATA } from '@utils/gql/queries'
import clsx from 'clsx'
import { utils } from 'ethers'
import React, { ChangeEvent, FC, useState } from 'react'
import toast from 'react-hot-toast'
import { RiImageAddLine } from 'react-icons/ri'
import { Profile } from 'src/types'
import { IPFSUploadResult } from 'src/types/local'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
}

const ChannelPicture: FC<Props> = ({ channel }) => {
  const { selectedChannel } = useAppStore()
  const [selectedPfp, setSelectedPfp] = useState('')
  const [loading, setLoading] = useState(false)

  const { signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { data: pfpData, write: writePfpUri } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY_ADDRESS,
      contractInterface: LENSHUB_PROXY_ABI
    },
    'setProfileImageURIWithSig',
    {
      onError(error: any) {
        setLoading(false)
        toast.error(error?.data?.message || error?.message)
      }
    }
  )

  const [createSetProfileImageURITypedData] = useMutation(
    SET_PFP_URI_TYPED_DATA,
    {
      onCompleted(data) {
        const typedData = data.createSetProfileImageURITypedData.typedData
        signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        }).then((signature) => {
          const { profileId, imageURI } = typedData?.value
          const { v, r, s } = utils.splitSignature(signature)
          writePfpUri({
            args: {
              profileId,
              imageURI,
              sig: { v, r, s, deadline: typedData.value.deadline }
            }
          })
        })
      },
      onError(error) {
        setLoading(false)
        toast.error(error.message)
      }
    }
  )

  const onPfpUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
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
    }
  }

  const onIndexed = () => {
    setLoading(false)
  }

  return (
    <>
      <div className="relative flex-none overflow-hidden rounded-full group">
        <img
          src={selectedPfp ? selectedPfp : getProfilePicture(channel)}
          className="w-32 h-32 border-2 rounded-full"
          draggable={false}
          alt=""
        />
        <label
          className={clsx(
            'absolute focus:visible top-0 grid w-32 h-32 bg-white rounded-full cursor-pointer bg-opacity-70 place-items-center backdrop-blur-lg lg:invisible group-hover:visible dark:bg-black',
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
      {pfpData?.hash && (
        <div className="flex justify-center mt-1">
          <PendingTxnLoader txnHash={pfpData?.hash} onIndexed={onIndexed} />
        </div>
      )}
    </>
  )
}

export default ChannelPicture

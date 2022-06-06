import { LENS_PERIPHERY_ABI } from '@abis/LensPeriphery'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import {
  ERROR_MESSAGE,
  LENS_PERIPHERY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_URL
} from '@utils/constants'
import { getKeyFromAttributes } from '@utils/functions/getKeyFromAttributes'
import omitKey from '@utils/functions/omitKey'
import { uploadDataToIPFS } from '@utils/functions/uploadToIPFS'
import { SET_PROFILE_METADATA_TYPED_DATA_MUTATION } from '@utils/gql/queries'
import useCopyToClipboard from '@utils/hooks/useCopyToClipboard'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import clsx from 'clsx'
import { utils } from 'ethers'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoCopyOutline } from 'react-icons/io5'
import { Attribute, MediaSet, Profile } from 'src/types'
import { BasicInfoSettings } from 'src/types/local'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile & {
    coverPicture: MediaSet
  }
}
const BasicInfo = ({ channel }: Props) => {
  const [, copy] = useCopyToClipboard()
  const [loading, setLoading] = useState(false)
  const [basicInfo, setBasicInfo] = useState<BasicInfoSettings>({
    about: channel.bio || '',
    cover: channel?.coverPicture?.original?.url || '',
    twitter:
      getKeyFromAttributes(channel.attributes as Attribute[], 'twitter') || '',
    website:
      getKeyFromAttributes(channel.attributes as Attribute[], 'website') || ''
  })
  const { signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
      setLoading(false)
    }
  })

  const { write: writeMetaData, data: writtenData } = useContractWrite(
    {
      addressOrName: LENS_PERIPHERY_ADDRESS,
      contractInterface: LENS_PERIPHERY_ABI
    },
    'setProfileMetadataURIWithSig',
    {
      onError(error: any) {
        toast.error(error?.data?.message ?? error?.message)
        setLoading(false)
      }
    }
  )
  const { indexed } = usePendingTxn(writtenData?.hash || '')

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      toast.success('Basic info updated 🎉')
    }
  }, [indexed])

  const [createSetProfileMetadataTypedData] = useMutation(
    SET_PROFILE_METADATA_TYPED_DATA_MUTATION,
    {
      onCompleted(data) {
        const typedData = data.createSetProfileMetadataTypedData.typedData
        signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        }).then((signature) => {
          const { profileId, metadata } = typedData?.value
          const { v, r, s } = utils.splitSignature(signature)
          writeMetaData({
            args: {
              user: channel?.ownedBy,
              profileId,
              metadata,
              sig: { v, r, s, deadline: typedData.value.deadline }
            }
          })
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
        setLoading(false)
      }
    }
  )

  const onCopyChannelUrl = (value: string) => {
    copy(value)
    toast.success('Copied to clipboard 🎉')
  }

  const onSaveBasicInfo = async () => {
    setLoading(true)
    const { ipfsUrl } = await uploadDataToIPFS({
      name: channel.name,
      bio: basicInfo.about,
      cover_picture: basicInfo.cover,
      attributes: [
        {
          traitType: 'string',
          key: 'website',
          value: basicInfo.website
        },
        {
          traitType: 'string',
          key: 'location',
          value: getKeyFromAttributes(
            channel.attributes as Attribute[],
            'location'
          )
        },
        {
          traitType: 'string',
          key: 'twitter',
          value: basicInfo.twitter
        },
        {
          traitType: 'string',
          key: 'app',
          value: LENSTUBE_APP_ID
        }
      ],
      version: '1.0.0',
      metadata_id: uuidv4(),
      appId: LENSTUBE_APP_ID
    })

    createSetProfileMetadataTypedData({
      variables: {
        request: {
          profileId: channel?.id,
          metadata: ipfsUrl
        }
      }
    })
  }

  return (
    <div className="p-3 bg-white rounded-md dark:bg-black">
      <div className="mt-4">
        <div className="flex items-center mb-1">
          <div className="required text-[11px] font-semibold uppercase opacity-70">
            Channel Name
          </div>
        </div>
        <div className="text-sm font-semibold">{channel.handle}</div>
      </div>
      <div className="mt-4">
        <div className="flex items-center mb-1">
          <div className="required text-[11px] font-semibold uppercase opacity-70">
            Channel URL
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span>
            {LENSTUBE_URL}/{channel.handle}
          </span>
          <button
            className="hover:opacity-60 focus:outline-none"
            onClick={() =>
              onCopyChannelUrl(`${LENSTUBE_URL}/${channel.handle}`)
            }
            type="button"
          >
            <IoCopyOutline />
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center mb-1">
          <div className="required text-[11px] font-semibold uppercase opacity-70">
            Channel Description
          </div>
        </div>
        <textarea
          placeholder="More about your channel"
          autoComplete="off"
          rows={5}
          className={clsx(
            'bg-white text-sm px-2.5 py-1 rounded-md dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full'
          )}
          value={basicInfo.about}
          onChange={(e) =>
            setBasicInfo({ ...basicInfo, about: e.target.value })
          }
        />
      </div>
      <div className="mt-4">
        <div className="flex items-center mb-1">
          <div className="required text-[11px] font-semibold uppercase opacity-70">
            Twitter
          </div>
        </div>
        <Input
          type="text"
          placeholder="johndoe"
          autoComplete="off"
          value={basicInfo?.twitter}
          autoFocus
          onChange={(e) =>
            setBasicInfo({ ...basicInfo, twitter: e.target.value })
          }
        />
      </div>
      <div className="mt-4">
        <div className="flex items-center mb-1">
          <div className="required text-[11px] font-semibold uppercase opacity-70">
            Website
          </div>
        </div>
        <Input
          type="text"
          placeholder="https://johndoe.xyz"
          autoComplete="off"
          value={basicInfo?.website}
          autoFocus
          onChange={(e) =>
            setBasicInfo({ ...basicInfo, website: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button disabled={loading} onClick={() => onSaveBasicInfo()}>
          {loading ? 'Saving' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default BasicInfo

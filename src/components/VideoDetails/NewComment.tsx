import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Button } from '@components/ui/Button'
import useAppStore from '@lib/store'
import {
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_COMMENTS_APP_ID
} from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import omitKey from '@utils/functions/omitKey'
import { uploadDataToIPFS } from '@utils/functions/uploadToIPFS'
import { CREATE_COMMENT_TYPED_DATA } from '@utils/gql/queries'
import clsx from 'clsx'
import { utils } from 'ethers'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { LenstubePublication } from 'src/types/local'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  video: LenstubePublication
}

const NewComment: FC<Props> = ({ video }) => {
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Comment')
  const [comment, setComment] = useState('')
  const { selectedChannel } = useAppStore()

  const { signTypedDataAsync } = useSignTypedData({
    onError() {
      setLoading(false)
    }
  })
  const { write: writeComment } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY_ADDRESS,
      contractInterface: LENSHUB_PROXY_ABI
    },
    'commentWithSig',
    {
      onSuccess() {
        setLoading(false)
        setButtonText('Comment')
        setComment('')
        toast.success('Commented successfully.')
      }
    }
  )
  const [createTypedData] = useMutation(CREATE_COMMENT_TYPED_DATA, {
    onCompleted(data) {
      const typedData = data.createCommentTypedData.typedData
      const {
        profileId,
        profileIdPointed,
        pubIdPointed,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleData,
        referenceModuleInitData
      } = typedData?.value
      setButtonText('Signing...')
      signTypedDataAsync({
        domain: omitKey(typedData?.domain, '__typename'),
        types: omitKey(typedData?.types, '__typename'),
        value: omitKey(typedData?.value, '__typename')
      })
        .then((signature) => {
          const { v, r, s } = utils.splitSignature(signature)
          setButtonText('Commenting...')
          writeComment({
            args: {
              profileId,
              profileIdPointed,
              pubIdPointed,
              contentURI,
              collectModule,
              collectModuleInitData,
              referenceModule,
              referenceModuleData,
              referenceModuleInitData,
              sig: { v, r, s, deadline: typedData.value.deadline }
            }
          })
        })
        .catch(() => {
          setButtonText('Comment')
          setLoading(false)
        })
    },
    onError(error) {
      toast.error(error.message)
      setButtonText('Comment')
      setLoading(false)
    }
  })

  const submitComment = async () => {
    if (comment.trim().length === 0) return
    setButtonText('Storing metadata...')
    setLoading(true)
    const { ipfsUrl } = await uploadDataToIPFS({
      version: '1.0.0',
      metadata_id: uuidv4(),
      description: comment,
      content: comment,
      external_url: null,
      image: null,
      imageMimeType: null,
      name: `${selectedChannel?.handle}'s comment on video ${video.metadata.name}`,
      attributes: [
        {
          displayType: 'string',
          traitType: 'Publication',
          value: 'LenstubeVideoComment'
        }
      ],
      media: [],
      appId: LENSTUBE_COMMENTS_APP_ID
    })
    createTypedData({
      variables: {
        request: {
          profileId: selectedChannel?.id,
          publicationId: video?.id,
          contentURI: ipfsUrl,
          collectModule: {
            freeCollectModule: {
              followerOnly: true
            }
          },
          referenceModule: {
            followerOnlyReferenceModule: false
          }
        }
      }
    })
  }

  if (!selectedChannel) return null

  return (
    <div className="my-4">
      <div className="flex items-center mb-2 space-x-3">
        <div className="flex-none">
          <img
            src={getProfilePicture(selectedChannel)}
            className="w-8 h-8 rounded-full"
            draggable={false}
            alt=""
          />
        </div>
        <textarea
          placeholder="How's this video?"
          autoComplete="off"
          rows={1}
          className={clsx(
            'bg-white text-xs p-3 rounded-md dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full'
          )}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button disabled={loading} onClick={() => submitComment()}>
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

export default NewComment

import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Button } from '@components/UIElements/Button'
import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { utils } from 'ethers'
import type {
  CreateCommentBroadcastItemResult,
  CreatePublicCommentRequest,
  Publication
} from 'lens'
import {
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  useBroadcastMutation,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation
} from 'lens'
import type { FC, Ref } from 'react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  TRACK
} from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'
import getUserLocale from 'utils/functions/getUserLocale'
import omitKey from 'utils/functions/omitKey'
import trimify from 'utils/functions/trimify'
import uploadToAr from 'utils/functions/uploadToAr'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { z } from 'zod'

type Props = {
  video: Publication
  defaultValue?: string
  placeholder?: string
  newCommentRef?: Ref<HTMLDivElement>
}

const formSchema = z.object({
  comment: z
    .string({ required_error: 'Enter valid comment' })
    .trim()
    .min(1, { message: 'Enter valid comment' })
    .max(5000, { message: 'Comment should not exceed 5000 characters' })
})
type FormData = z.infer<typeof formSchema>

const NewComment: FC<Props> = ({
  video,
  defaultValue = '',
  placeholder = "How's this video?",
  newCommentRef = null
}) => {
  const [loading, setLoading] = useState(false)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const setQueuedComments = usePersistStore((state) => state.setQueuedComments)
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)

  const {
    clearErrors,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues
  } = useForm<FormData>({
    defaultValues: {
      comment: defaultValue
    },
    resolver: zodResolver(formSchema)
  })

  useEffect(() => {
    setValue('comment', defaultValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue])

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    setQueuedComments([
      {
        comment: getValues('comment'),
        txnId: txn.txnId,
        txnHash: txn.txnHash,
        pubId: video.id
      },
      ...(queuedComments || [])
    ])
    reset()
    setLoading(false)
  }

  const onCompleted = (data: any) => {
    if (
      data?.broadcast?.reason === 'NOT_ALLOWED' ||
      data.createCommentViaDispatcher?.reason
    ) {
      return
    }
    Analytics.track(TRACK.PUBLICATION.NEW_COMMENT)
    const txnId =
      data?.createCommentViaDispatcher?.txId ?? data?.broadcast?.txId
    return setToQueue({ txnId })
  }

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write: writeComment } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'commentWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: (data) => {
      if (data.hash) {
        setToQueue({ txnHash: data.hash })
      }
    }
  })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted
  })

  const [createCommentViaDispatcher] = useCreateCommentViaDispatcherMutation({
    onError,
    onCompleted
  })

  const [createCommentTypedData] = useCreateCommentTypedDataMutation({
    onCompleted: async ({ createCommentTypedData }) => {
      const { typedData, id } =
        createCommentTypedData as CreateCommentBroadcastItemResult
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
      try {
        toast.loading('Requesting signature...')
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        const { v, r, s } = utils.splitSignature(signature)
        const args = {
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
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          writeComment?.({ recklesslySetUnpreparedArgs: [args] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const createTypedData = (request: CreatePublicCommentRequest) => {
    createCommentTypedData({
      variables: { options: { overrideSigNonce: userSigNonce }, request }
    })
  }

  const createViaDispatcher = async (request: CreatePublicCommentRequest) => {
    const { data } = await createCommentViaDispatcher({
      variables: { request }
    })
    if (data?.createCommentViaDispatcher.__typename === 'RelayError') {
      createTypedData(request)
    }
  }

  const submitComment = async (data: FormData) => {
    try {
      setLoading(true)
      const { url } = await uploadToAr({
        version: '2.0.0',
        metadata_id: uuidv4(),
        description: trimify(data.comment),
        content: trimify(data.comment),
        locale: getUserLocale(),
        mainContentFocus: PublicationMainFocus.TextOnly,
        external_url: `${LENSTUBE_WEBSITE_URL}/watch/${video?.id}`,
        image: null,
        imageMimeType: null,
        name: `${selectedChannel?.handle}'s comment on video ${video.metadata.name}`,
        attributes: [
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'publication',
            value: 'comment'
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'app',
            value: LENSTUBE_APP_ID
          }
        ],
        media: [],
        appId: LENSTUBE_APP_ID
      })
      const request = {
        profileId: selectedChannel?.id,
        publicationId: video?.id,
        contentURI: url,
        collectModule: {
          revertCollectModule: true
        },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      }
      const canUseDispatcher = selectedChannel?.dispatcher?.canUseRelay
      if (!canUseDispatcher) {
        return createTypedData(request)
      }
      await createViaDispatcher(request)
    } catch {}
  }

  if (!selectedChannel || !selectedChannelId) {
    return null
  }

  return (
    <form
      onSubmit={handleSubmit(submitComment)}
      className="mb-2 flex w-full flex-wrap items-start justify-end gap-2"
    >
      <div className="flex flex-1 items-center space-x-2 md:space-x-3">
        <div className="flex-none">
          <img
            src={getProfilePicture(selectedChannel, 'avatar')}
            className="h-9 w-9 rounded-full"
            draggable={false}
            alt={selectedChannel?.handle}
          />
        </div>
        <div className="relative w-full" ref={newCommentRef}>
          <InputMentions
            placeholder={placeholder}
            autoComplete="off"
            validationError={errors.comment?.message}
            value={watch('comment')}
            onContentChange={(value) => {
              setValue('comment', value)
              clearErrors('comment')
            }}
            mentionsSelector="input-mentions-single"
          />
          <div className="absolute bottom-2 right-2">
            <EmojiPicker
              onEmojiSelect={(emoji) =>
                setValue('comment', `${getValues('comment')}${emoji}`)
              }
            />
          </div>
        </div>
      </div>
      <Button loading={loading}>Comment</Button>
    </form>
  )
}

export default NewComment

import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS } from '@tape.xyz/constants'
import { checkLensManagerPermissions, getSignature } from '@tape.xyz/generic'
import type {
  ActOnOpenActionLensManagerRequest,
  ModuleMetadata,
  UnknownOpenActionModuleSettings
} from '@tape.xyz/lens'
import {
  useActOnOpenActionMutation,
  useBroadcastOnchainMutation,
  useCreateActOnOpenActionTypedDataMutation,
  useModuleMetadataQuery
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  VerifiedSolid
} from '@tape.xyz/ui'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSignTypedData, useWriteContract } from 'wagmi'

import { VERIFIED_UNKNOWN_OPEN_ACTION_CONTRACTS } from '../verified-contracts'
import TipOpenAction from './Tip'

const UnknownOpenAction = ({
  action,
  publicationId
}: {
  action: UnknownOpenActionModuleSettings
  publicationId: string
}) => {
  const [acting, setActing] = useState(true)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setActing(false)
  }

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return
    }
    setActing(false)
    toast.success('Acted successfully')
  }

  const handleWrongNetwork = useHandleWrongNetwork()
  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } })

  const activeProfile = useProfileStore((state) => state.activeProfile)
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()

  const { canUseLensManager, canBroadcast } =
    checkLensManagerPermissions(activeProfile)

  const { data: module, loading } = useModuleMetadataQuery({
    variables: { request: { implementation: action?.contract.address } },
    skip: !Boolean(action?.contract.address)
  })

  const metadata = module?.moduleMetadata?.metadata

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => {
        onCompleted()
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
      },
      onError: (error) => {
        onError(error)
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
      }
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'act',
      args
    })
  }

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  })

  const [createActOnOpenActionTypedData] =
    useCreateActOnOpenActionTypedDataMutation({
      onCompleted: async ({ createActOnOpenActionTypedData }) => {
        const { id, typedData } = createActOnOpenActionTypedData
        const args = [typedData.value]
        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData))
          setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return await write({ args })
          }
          return
        }
        return await write({ args })
      },
      onError
    })

  const [actOnOpenAction] = useActOnOpenActionMutation({
    onCompleted: ({ actOnOpenAction }) =>
      onCompleted(actOnOpenAction.__typename),
    onError
  })

  const actViaLensManager = async (
    request: ActOnOpenActionLensManagerRequest
  ) => {
    const { data, errors } = await actOnOpenAction({ variables: { request } })

    if (errors?.toString().includes('has already acted on')) {
      return
    }

    if (
      !data?.actOnOpenAction ||
      data?.actOnOpenAction.__typename === 'LensProfileManagerRelayError'
    ) {
      return await createActOnOpenActionTypedData({ variables: { request } })
    }
  }

  const actOnUnknownOpenAction = async (address: string, data: string) => {
    await handleWrongNetwork()

    setActing(true)
    const actOnRequest: ActOnOpenActionLensManagerRequest = {
      for: publicationId,
      actOn: {
        unknownOpenAction: {
          address,
          data
        }
      }
    }

    if (canUseLensManager && action.signlessApproved) {
      return await actViaLensManager(actOnRequest)
    }

    return await createActOnOpenActionTypedData({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: actOnRequest
      }
    })
  }

  const renderAction = () => {
    if (!metadata) {
      return null
    }
    switch (action.contract.address) {
      case VERIFIED_UNKNOWN_OPEN_ACTION_CONTRACTS.TIP:
        return (
          <TipOpenAction
            acting={acting}
            action={action}
            metadata={metadata as ModuleMetadata}
            actOnUnknownOpenAction={actOnUnknownOpenAction}
          />
        )
    }
  }

  if (loading || !metadata) {
    return (
      <div className="animate-shimmer h-[70px] rounded-lg bg-gray-200 dark:bg-gray-800" />
    )
  }

  return (
    <AccordionItem
      value="item-2"
      className="rounded-small group border dark:border-gray-700"
    >
      <AccordionTrigger className="bg-brand-50/50 dark:bg-brand-950/30 rounded-small w-full px-4 py-3 text-left">
        <div className="flex items-center space-x-1 font-bold">
          <span>{metadata?.title || 'Unknown action'}</span>
          {module?.moduleMetadata?.verified && (
            <VerifiedSolid className="-mb-0.5 ml-0.5 size-3 text-green-500" />
          )}
        </div>
        {metadata?.description && (
          <p className="text-sm opacity-80">{metadata?.description} </p>
        )}
      </AccordionTrigger>
      <AccordionContent className="p-3">{renderAction()}</AccordionContent>
    </AccordionItem>
  )
}

export default UnknownOpenAction

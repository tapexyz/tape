import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { ERROR_MESSAGE } from '@tape.xyz/constants'
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
import { useContractWrite, useSignTypedData } from 'wagmi'

import { VERIFIED_UNKNOWN_OPEN_ACTION_CONTRACTS } from '../verified-contracts'
import TipOpenAction from './Tip'

const UnknownOpenAction = ({
  action,
  publicationId
}: {
  action: UnknownOpenActionModuleSettings
  publicationId: string
}) => {
  const [acting, setActing] = useState(false)

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

  const { signTypedDataAsync } = useSignTypedData({ onError })

  const activeProfile = useProfileStore((state) => state.activeProfile)
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()

  const { canUseLensManager, canBroadcast } =
    checkLensManagerPermissions(activeProfile)

  const { data: module, loading } = useModuleMetadataQuery({
    variables: { request: { implementation: action?.contract.address } },
    skip: !Boolean(action?.contract.address)
  })

  const metadata = module?.moduleMetadata?.metadata

  const { write } = useContractWrite({
    address: action.contract.address,
    abi: JSON.parse(metadata?.processCalldataABI ?? []),
    functionName: 'processPublicationAction',
    onSuccess: () => {
      onCompleted()
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
    },
    onError: (error) => {
      onError(error)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
    }
  })

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
            return write({ args })
          }
          return
        }
        return write({ args })
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
    const actOnRequest: ActOnOpenActionLensManagerRequest = {
      for: publicationId,
      actOn: {
        unknownOpenAction: {
          address,
          data
        }
      }
    }

    if (canUseLensManager) {
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
    return null
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

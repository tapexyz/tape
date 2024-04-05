import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type {
  ConsumeProtectedDataParams,
  ConsumeProtectedDataResponse,
  GetGrantedAccessParams,
  OnStatusUpdateFn,
  RentProtectedDataParams,
  SuccessWithTransactionHash
} from '@iexec/dataprotector'
import { generateSignatureChallenge, getIExec } from '@lib/iexec/walletProvider'
import WalletType from '@lib/iexec/walletType'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import {
  CONSUME_CONTENT_DAPP,
  ERROR_MESSAGE,
  SIGN_IN_REQUIRED
} from '@tape.xyz/constants'
import { checkLensManagerPermissions } from '@tape.xyz/generic'
import type { MirrorablePublication } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSignMessage } from 'wagmi'

type Props = {
  video: MirrorablePublication
  onMirrorSuccess?: () => void
  children: React.ReactNode
  successToast?: string
}

const ConsumePublication: FC<Props> = ({
  video,
  children,
  onMirrorSuccess,
  successToast = 'Mirrored video across lens.'
}) => {
  const [loading, setLoading] = useState(false)
  const handleWrongNetwork = useHandleWrongNetwork()
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const { signMessage } = useSignMessage()
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const { canUseLensManager, canBroadcast } =
    checkLensManagerPermissions(activeProfile)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onConsumeStatusUpdate: OnStatusUpdateFn<
    'UPLOAD_RESULT_TO_IPFS' | 'CONSUME_PROTECTED_DATA'
  > = ({ title, isDone, payload }) => {}

  const consume = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    await handleWrongNetwork()

    if (video.momoka?.proof && !activeProfile?.sponsor) {
      return toast.error(
        'Momoka is currently in beta - during this time certain actions are not available to all profiles.'
      )
    }

    try {
      setLoading(true)

      let protectedDataAddressItem = video.metadata?.attributes?.find(
        (item) => {
          return item.key == 'protectedContentAddress'
        }
      )
      let protectedDataAddress = protectedDataAddressItem?.value

      toast.loading('Requesting signature to use your iExec Manager')
      let messageToSign = generateSignatureChallenge(
        activeProfile?.ownedBy.address
      )
      signMessage(
        { message: messageToSign },
        {
          onSuccess: async (signature) => {
            try {
              let iexec = getIExec(
                WalletType.CONTENT_CONSUMER,
                activeProfile,
                signature
              )

              let getGrantedAccessParam: GetGrantedAccessParams = {
                protectedData: protectedDataAddress,
                authorizedApp: CONSUME_CONTENT_DAPP
              }

              let rentParams: RentProtectedDataParams = {
                protectedDataAddress: protectedDataAddress || ''
              }

              let rentResult: SuccessWithTransactionHash | undefined =
                await iexec?.sharing.rentProtectedData(rentParams)

              let consumeParams: ConsumeProtectedDataParams = {
                protectedDataAddress: protectedDataAddress || '',
                onStatusUpdate: onConsumeStatusUpdate
              }

              let consumeResponse: ConsumeProtectedDataResponse | undefined =
                await iexec?.sharing.consumeProtectedData(consumeParams)

              throw video
            } catch (e) {}
          }
        }
      )
      //TODO: change this to consumer
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="inline-flex">
      <button
        type="button"
        className="disabled:opacity-50"
        disabled={loading}
        onClick={() => consume()}
      >
        {children}
      </button>
    </div>
  )
}

export default ConsumePublication

import { useLazyQuery } from '@apollo/client'
import Alert from '@components/Common/Alert'
import { Loader } from '@components/UIElements/Loader'
import { getCollectModuleConfig } from '@utils/functions/getCollectModule'
import { GENERATE_ALLOWANCE_QUERY } from '@utils/gql/queries'
import React, { Dispatch, FC } from 'react'
import toast from 'react-hot-toast'
import { ApprovedAllowanceAmount } from 'src/types'
import { LenstubeCollectModule } from 'src/types/local'
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction
} from 'wagmi'

type Props = {
  collectModule: LenstubeCollectModule
  setIsAllowed: Dispatch<boolean>
  isAllowed: boolean
  allowanceModule: ApprovedAllowanceAmount
}

const PermissionAlert: FC<Props> = ({
  collectModule,
  setIsAllowed,
  isAllowed,
  allowanceModule
}) => {
  const [generateAllowanceQuery, { loading }] = useLazyQuery(
    GENERATE_ALLOWANCE_QUERY
  )

  const { config: prepareTxn } = usePrepareSendTransaction({
    request: {}
  })
  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    ...prepareTxn,
    mode: 'recklesslyUnprepared',
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { isLoading: waiting } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess() {
      toast.success(
        `Module ${isAllowed ? 'disabled' : 'enabled'} successfully!`
      )
      setIsAllowed(!isAllowed)
    },
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const handleAllowance = async () => {
    const result = await generateAllowanceQuery({
      variables: {
        request: {
          currency: allowanceModule.currency,
          value: Number.MAX_SAFE_INTEGER.toString(),
          [getCollectModuleConfig(allowanceModule.module).type]:
            allowanceModule.module
        }
      }
    })
    const data = result?.data?.generateModuleCurrencyApprovalData
    sendTransaction?.({
      recklesslySetUnpreparedRequest: {
        from: data?.from,
        to: data?.to,
        data: data?.data
      }
    })
  }

  return (
    <div className="flex-1">
      <Alert variant="warning">
        <button
          type="button"
          disabled={transactionLoading || waiting || loading}
          className="flex justify-center mx-auto text-sm outline-none"
          onClick={() => handleAllowance()}
        >
          {transactionLoading || waiting || loading ? (
            <Loader />
          ) : (
            <span className="flex items-center justify-center">
              Allow {collectModule.type} for{' '}
              {collectModule?.amount?.asset?.symbol}
            </span>
          )}
        </button>
      </Alert>
    </div>
  )
}

export default PermissionAlert

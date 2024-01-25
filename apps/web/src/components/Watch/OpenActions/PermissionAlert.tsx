import { getCollectModuleConfig } from '@lib/getCollectModuleInput'
import type { ApprovedAllowanceAmountResult } from '@tape.xyz/lens'
import {
  OpenActionModuleType,
  useGenerateModuleCurrencyApprovalDataLazyQuery
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Button } from '@tape.xyz/ui'
import type { Dispatch, FC } from 'react'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'

type Props = {
  setIsAllowed: Dispatch<boolean>
  isAllowed: boolean
  allowanceModule: ApprovedAllowanceAmountResult
}

const PermissionAlert: FC<Props> = ({
  setIsAllowed,
  isAllowed,
  allowanceModule
}) => {
  const [generateAllowanceQuery, { loading }] =
    useGenerateModuleCurrencyApprovalDataLazyQuery()

  const {
    data: txnHash,
    isPending: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    mutation: {
      onError: (error: CustomErrorWithData) => {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  })
  const {
    isLoading: waiting,
    isSuccess,
    isError,
    error
  } = useWaitForTransactionReceipt({
    hash: txnHash
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        `Allowance ${isAllowed ? `disabled` : `enabled`} successfully!`
      )
      setIsAllowed(!isAllowed)
    }
    if (isError) {
      toast.error(error?.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError])

  const handleAllowance = async () => {
    const isUnknownModule =
      allowanceModule.moduleName ===
      OpenActionModuleType.UnknownOpenActionModule

    const result = await generateAllowanceQuery({
      variables: {
        request: {
          allowance: {
            currency: allowanceModule?.allowance.asset.contract.address,
            value: Number.MAX_SAFE_INTEGER.toString()
          },
          module: {
            [getCollectModuleConfig(allowanceModule).type]: isUnknownModule
              ? allowanceModule.moduleContract.address
              : allowanceModule.moduleName
          }
        }
      }
    })
    const data = result?.data?.generateModuleCurrencyApprovalData
    sendTransaction?.({
      to: data?.to,
      data: data?.data
    })
  }

  const processing = transactionLoading || waiting || loading

  return (
    <div className="flex justify-end">
      <Button
        loading={processing}
        disabled={processing}
        onClick={() => handleAllowance()}
      >
        Allow Collect
      </Button>
    </div>
  )
}

export default PermissionAlert

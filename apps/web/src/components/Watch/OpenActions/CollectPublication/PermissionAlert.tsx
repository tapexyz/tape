import type { ApprovedAllowanceAmountResult } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { Dispatch, FC } from 'react'

import { getCollectModuleConfig } from '@lib/getCollectModuleInput'
import { Button } from '@radix-ui/themes'
import { useGenerateModuleCurrencyApprovalDataLazyQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React from 'react'
import toast from 'react-hot-toast'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'

type Props = {
  allowanceModule: ApprovedAllowanceAmountResult
  isAllowed: boolean
  setIsAllowed: Dispatch<boolean>
}

const PermissionAlert: FC<Props> = ({
  allowanceModule,
  isAllowed,
  setIsAllowed
}) => {
  const [generateAllowanceQuery, { loading }] =
    useGenerateModuleCurrencyApprovalDataLazyQuery()

  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    onError: (error: CustomErrorWithData) => {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { isLoading: waiting } = useWaitForTransaction({
    hash: txData?.hash,
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    },
    onSuccess: () => {
      toast.success(
        `Module ${isAllowed ? `disabled` : `enabled`} successfully!`
      )
      setIsAllowed(!isAllowed)
    }
  })

  const handleAllowance = async () => {
    const result = await generateAllowanceQuery({
      variables: {
        request: {
          allowance: {
            currency: allowanceModule.allowance.asset.contract.address,
            value: Number.MAX_SAFE_INTEGER.toString()
          },
          module: {
            [getCollectModuleConfig(allowanceModule.moduleName).type]:
              allowanceModule.moduleName
          }
        }
      }
    })
    const data = result?.data?.generateModuleCurrencyApprovalData
    sendTransaction?.({
      data: data?.data,
      to: data?.to
    })
  }

  const processing = transactionLoading || waiting || loading

  return (
    <div className="flex justify-end">
      <Button
        disabled={processing}
        highContrast
        onClick={() => handleAllowance()}
      >
        {processing && <Loader size="sm" />}
        Allow Collect
      </Button>
    </div>
  )
}

export default PermissionAlert

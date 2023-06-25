import { Button } from '@components/UIElements/Button'
import { getCollectModuleConfig } from '@lenstube/generic'
import type { ApprovedAllowanceAmount } from '@lenstube/lens'
import { useGenerateModuleCurrencyApprovalDataLazyQuery } from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import { t, Trans } from '@lingui/macro'
import type { Dispatch, FC } from 'react'
import React from 'react'
import toast from 'react-hot-toast'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'

type Props = {
  setIsAllowed: Dispatch<boolean>
  isAllowed: boolean
  allowanceModule: ApprovedAllowanceAmount
}

const PermissionAlert: FC<Props> = ({
  setIsAllowed,
  isAllowed,
  allowanceModule
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
    onSuccess: () => {
      toast.success(
        `Module ${isAllowed ? t`disabled` : t`enabled`} successfully!`
      )
      setIsAllowed(!isAllowed)
    },
    onError(error: CustomErrorWithData) {
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
      to: data?.to,
      data: data?.data
    })
  }

  return (
    <div className="flex justify-end">
      <Button
        loading={transactionLoading || waiting || loading}
        onClick={() => handleAllowance()}
      >
        <Trans>Allow Collect</Trans>
      </Button>
    </div>
  )
}

export default PermissionAlert

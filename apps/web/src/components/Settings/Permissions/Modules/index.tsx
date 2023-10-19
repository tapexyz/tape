import { getCollectModuleConfig } from '@lib/getCollectModuleInput'
import useAuthPersistStore from '@lib/store/auth'
import { t, Trans } from '@lingui/macro'
import { Button, Select } from '@radix-ui/themes'
import { WMATIC_TOKEN_ADDRESS } from '@tape.xyz/constants'
import type { ApprovedAllowanceAmountResult, Erc20 } from '@tape.xyz/lens'
import {
  FollowModuleType,
  LimitType,
  OpenActionModuleType,
  useApprovedModuleAllowanceAmountQuery,
  useEnabledCurrenciesQuery,
  useGenerateModuleCurrencyApprovalDataLazyQuery
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'

const ModulePermissions = () => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const [currency, setCurrency] = useState(WMATIC_TOKEN_ADDRESS)
  const [loadingModule, setLoadingModule] = useState('')

  const { data: txData, sendTransaction } = useSendTransaction({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
      setLoadingModule('')
    }
  })

  const {
    data,
    refetch,
    loading: gettingSettings
  } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: [currency],
        followModules: [FollowModuleType.FeeFollowModule],
        openActionModules: [
          OpenActionModuleType.SimpleCollectOpenActionModule,
          OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
        ]
      }
    },
    skip: !selectedSimpleProfile?.id,
    fetchPolicy: 'no-cache'
  })

  useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      refetch()
      toast.success(t`Permission updated`)
      setLoadingModule('')
    },
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
      setLoadingModule('')
    }
  })

  const [generateAllowanceQuery] =
    useGenerateModuleCurrencyApprovalDataLazyQuery()

  const { data: enabledCurrencies } = useEnabledCurrenciesQuery({
    variables: {
      request: {
        limit: LimitType.Fifty
      }
    }
  })

  const handleClick = async (isAllow: boolean, selectedModule: string) => {
    try {
      setLoadingModule(selectedModule)
      const { data: allowanceData } = await generateAllowanceQuery({
        variables: {
          request: {
            allowance: {
              currency,
              value: isAllow ? Number.MAX_SAFE_INTEGER.toString() : '0'
            },
            module: {
              [getCollectModuleConfig(selectedModule).type]: selectedModule
            }
          }
        }
      })
      const generated = allowanceData?.generateModuleCurrencyApprovalData
      sendTransaction?.({
        to: generated?.to,
        data: generated?.data
      })
    } catch {
      setLoadingModule('')
    }
  }

  return (
    <div className="pt-6">
      <div className="space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">
          <Trans>Access permissions</Trans>
        </h1>
        <p className="opacity-80">
          <Trans>
            These are the collect modules which you allowed / need to allow to
            use collect feature. You can allow and revoke access anytime.
          </Trans>
        </p>
      </div>
      <div>
        {!gettingSettings && data && (
          <div className="flex justify-end py-6">
            <Select.Root
              size="3"
              value={currency}
              onValueChange={(value) => setCurrency(value)}
            >
              <Select.Trigger className="w-full" />
              <Select.Content highContrast>
                {enabledCurrencies?.currencies.items?.map((token: Erc20) => (
                  <Select.Item
                    key={token.contract.address}
                    value={token.contract.address}
                  >
                    {token.symbol}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        )}
        {gettingSettings && (
          <div className="grid h-24 place-items-center">
            <Loader />
          </div>
        )}
        {!gettingSettings &&
          data?.approvedModuleAllowanceAmount?.map(
            (moduleItem: ApprovedAllowanceAmountResult) => (
              <div
                key={moduleItem.moduleContract.address}
                className="flex items-center rounded-md pb-4"
              >
                <div className="flex-1">
                  <h6 className="font-medium">
                    {getCollectModuleConfig(moduleItem.moduleName).label}
                  </h6>
                  <p className="opacity-70">
                    {getCollectModuleConfig(moduleItem.moduleName).description}
                  </p>
                </div>
                <div className="ml-2 flex flex-none items-center space-x-2">
                  {moduleItem?.allowance.value === '0x00' ? (
                    <Button
                      size="3"
                      highContrast
                      disabled={loadingModule === moduleItem.moduleName}
                      onClick={() => handleClick(true, moduleItem.moduleName)}
                    >
                      <Trans>Allow</Trans>
                    </Button>
                  ) : (
                    <Button
                      size="3"
                      color="red"
                      onClick={() => handleClick(false, moduleItem.moduleName)}
                      disabled={loadingModule === moduleItem.moduleName}
                    >
                      <Trans>Revoke</Trans>
                    </Button>
                  )}
                </div>
              </div>
            )
          )}
      </div>
    </div>
  )
}

export default ModulePermissions

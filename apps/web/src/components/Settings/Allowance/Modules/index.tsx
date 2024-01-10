import { getCollectModuleConfig } from '@lib/getCollectModuleInput'
import useProfileStore from '@lib/store/idb/profile'
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
import { Button, Select, SelectItem, Spinner } from '@tape.xyz/ui'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'

const ModuleAllowance = () => {
  const { activeProfile } = useProfileStore()

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
          OpenActionModuleType.MultirecipientFeeCollectOpenActionModule,
          OpenActionModuleType.LegacySimpleCollectModule,
          OpenActionModuleType.LegacyMultirecipientFeeCollectModule
        ]
      }
    },
    skip: !activeProfile?.id,
    fetchPolicy: 'no-cache'
  })

  useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      refetch()
      toast.success(`Permission updated`)
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
  const currencies = enabledCurrencies?.currencies.items

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
    <div>
      <div className="space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">Allowance</h1>
        <p className="opacity-80">
          These are the collect modules which you allowed / need to allow to use
          collect feature. You can allow and revoke access anytime.
        </p>
      </div>
      <div>
        {!gettingSettings && data && (
          <div className="flex justify-end py-6">
            <Select
              value={currency}
              onValueChange={(value) => setCurrency(value)}
            >
              {currencies?.map((token: Erc20) => (
                <SelectItem
                  key={token.contract.address}
                  value={token.contract.address}
                >
                  {token.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}
        {gettingSettings && (
          <div className="grid h-24 place-items-center">
            <Spinner />
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
                  {parseFloat(moduleItem?.allowance.value) === 0 ? (
                    <Button
                      disabled={loadingModule === moduleItem.moduleName}
                      loading={loadingModule === moduleItem.moduleName}
                      onClick={() => handleClick(true, moduleItem.moduleName)}
                    >
                      Allow
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      onClick={() => handleClick(false, moduleItem.moduleName)}
                      disabled={loadingModule === moduleItem.moduleName}
                      loading={loadingModule === moduleItem.moduleName}
                    >
                      Revoke
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

export default ModuleAllowance

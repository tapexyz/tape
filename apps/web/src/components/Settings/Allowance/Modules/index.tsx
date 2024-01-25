import { VERIFIED_UNKNOWN_OPEN_ACTION_CONTRACTS } from '@components/Watch/OpenActions/verified-contracts'
import { getCollectModuleConfig } from '@lib/getCollectModuleInput'
import useProfileStore from '@lib/store/idb/profile'
import useAllowedTokensStore from '@lib/store/idb/tokens'
import { POLYGONSCAN_URL, WMATIC_TOKEN_ADDRESS } from '@tape.xyz/constants'
import { shortenAddress } from '@tape.xyz/generic'
import type { ApprovedAllowanceAmountResult } from '@tape.xyz/lens'
import {
  FollowModuleType,
  OpenActionModuleType,
  useApprovedModuleAllowanceAmountQuery,
  useGenerateModuleCurrencyApprovalDataLazyQuery
} from '@tape.xyz/lens'
import { Button, Select, SelectItem, Spinner } from '@tape.xyz/ui'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'

const ModuleItem = ({
  moduleItem,
  currency,
  onSuccess
}: {
  moduleItem: ApprovedAllowanceAmountResult
  currency: string
  onSuccess: () => void
}) => {
  const [loadingModule, setLoadingModule] = useState('')

  const [generateAllowanceQuery] =
    useGenerateModuleCurrencyApprovalDataLazyQuery()

  const { data: hash, sendTransaction } = useSendTransaction({
    mutation: {
      onError: (error) => {
        toast.error(error?.message)
        setLoadingModule('')
      }
    }
  })

  const { isSuccess, error, isError } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: hash && hash.length > 0
    }
  })

  useEffect(() => {
    if (isError) {
      toast.error(error?.message)
      setLoadingModule('')
    }
    if (isSuccess) {
      onSuccess()
      toast.success(`Allowance updated`)
      setLoadingModule('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isSuccess, error])

  const handleClick = async (
    isAllow: boolean,
    module: ApprovedAllowanceAmountResult
  ) => {
    try {
      setLoadingModule(module.moduleName)
      const isUnknownModule =
        module.moduleName === OpenActionModuleType.UnknownOpenActionModule
      const { data: allowanceData } = await generateAllowanceQuery({
        variables: {
          request: {
            allowance: {
              currency,
              value: isAllow ? Number.MAX_SAFE_INTEGER.toString() : '0'
            },
            module: {
              [getCollectModuleConfig(module).type]: isUnknownModule
                ? module.moduleContract.address
                : module.moduleName
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
    <div
      key={moduleItem.moduleContract.address}
      className="flex items-center rounded-md pb-4"
    >
      <div className="flex-1">
        <h6 className="font-medium">
          {getCollectModuleConfig(moduleItem).label} (
          <Link
            className="text-xs"
            target="_blank"
            href={`${POLYGONSCAN_URL}/address/${moduleItem.moduleContract.address}`}
          >
            {shortenAddress(moduleItem.moduleContract.address)})
          </Link>
        </h6>
        <p className="opacity-70">
          {getCollectModuleConfig(moduleItem).description}
        </p>
      </div>
      <div className="ml-2 flex flex-none items-center space-x-2">
        {parseFloat(moduleItem?.allowance.value) === 0 ? (
          <Button
            disabled={loadingModule === moduleItem.moduleName}
            loading={loadingModule === moduleItem.moduleName}
            onClick={() => handleClick(true, moduleItem)}
          >
            Allow
          </Button>
        ) : (
          <Button
            variant="danger"
            onClick={() => handleClick(false, moduleItem)}
            disabled={loadingModule === moduleItem.moduleName}
            loading={loadingModule === moduleItem.moduleName}
          >
            Revoke
          </Button>
        )}
      </div>
    </div>
  )
}

const ModuleAllowance = () => {
  const { activeProfile } = useProfileStore()
  const [currency, setCurrency] = useState(WMATIC_TOKEN_ADDRESS)
  const allowedTokens = useAllowedTokensStore((state) => state.allowedTokens)

  const {
    data: commonAllowancesData,
    refetch: refetchCommonApproved,
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

  const {
    data: unKnownActAllowancesData,
    refetch: refetchUnknownActApproved,
    loading: gettingUnknownActSettings
  } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: [currency],
        unknownOpenActionModules: [VERIFIED_UNKNOWN_OPEN_ACTION_CONTRACTS.TIP]
      }
    },
    skip: !activeProfile?.id,
    fetchPolicy: 'no-cache'
  })

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
        {!gettingSettings && commonAllowancesData && (
          <div className="flex justify-end py-6">
            <Select
              value={currency}
              onValueChange={(value) => setCurrency(value)}
            >
              {allowedTokens?.map((token) => (
                <SelectItem key={token.address} value={token.address}>
                  {token.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}
        {gettingSettings || gettingUnknownActSettings ? (
          <div className="grid h-24 place-items-center">
            <Spinner />
          </div>
        ) : null}
        {!gettingSettings &&
          commonAllowancesData?.approvedModuleAllowanceAmount?.map(
            (moduleItem: ApprovedAllowanceAmountResult) => (
              <ModuleItem
                key={moduleItem.moduleContract.address}
                moduleItem={moduleItem}
                currency={currency}
                onSuccess={() => {
                  refetchCommonApproved()
                  refetchUnknownActApproved()
                }}
              />
            )
          )}
        {unKnownActAllowancesData?.approvedModuleAllowanceAmount.length ? (
          <h6 className="text-brand-500 mb-2 mt-4 font-medium">Open Actions</h6>
        ) : null}
        {!gettingUnknownActSettings &&
          unKnownActAllowancesData?.approvedModuleAllowanceAmount?.map(
            (moduleItem: ApprovedAllowanceAmountResult) => (
              <ModuleItem
                key={moduleItem.moduleContract.address}
                moduleItem={moduleItem}
                currency={currency}
                onSuccess={() => {
                  refetchCommonApproved()
                  refetchUnknownActApproved()
                }}
              />
            )
          )}
      </div>
    </div>
  )
}

export default ModuleAllowance

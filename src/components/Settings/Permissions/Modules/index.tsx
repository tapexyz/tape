import { useLazyQuery, useQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import { WMATIC_TOKEN_ADDRESS } from '@utils/constants'
import { getCollectModuleConfig } from '@utils/functions/getCollectModule'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  ApprovedAllowanceAmount,
  ApprovedModuleAllowanceAmountDocument,
  CollectModules,
  Erc20,
  FollowModules,
  GenerateModuleCurrencyApprovalDataDocument,
  ReferenceModules
} from 'src/types/lens'
import { CustomErrorWithData } from 'src/types/local'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'

const collectModules = [
  'FeeCollectModule',
  'TimedFeeCollectModule',
  'FeeFollowModule',
  'LimitedFeeCollectModule',
  'LimitedTimedFeeCollectModule'
]

const ModulePermissions = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [currency, setCurrency] = useState(WMATIC_TOKEN_ADDRESS)
  const [loadingModule, setLoadingModule] = useState('')

  const { data: txData, sendTransaction } = useSendTransaction({
    request: {},
    mode: 'recklesslyUnprepared',
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const {
    data,
    refetch,
    loading: gettingSettings
  } = useQuery(ApprovedModuleAllowanceAmountDocument, {
    variables: {
      request: {
        currencies: [currency],
        followModules: [FollowModules.FeeFollowModule],
        collectModules: [
          CollectModules.FreeCollectModule,
          CollectModules.FeeCollectModule,
          CollectModules.LimitedFeeCollectModule,
          CollectModules.LimitedTimedFeeCollectModule,
          CollectModules.TimedFeeCollectModule,
          CollectModules.RevertCollectModule
        ],
        referenceModules: [ReferenceModules.FollowerOnlyReferenceModule]
      }
    },
    skip: !selectedChannel?.id
  })
  useWaitForTransaction({
    hash: txData?.hash,
    onSuccess() {
      toast.success('Permission updated')
      setLoadingModule('')
      refetch()
    },
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const [generateAllowanceQuery] = useLazyQuery(
    GenerateModuleCurrencyApprovalDataDocument
  )

  const handleClick = async (isAllow: boolean, selectedModule: string) => {
    try {
      setLoadingModule(selectedModule)
      const { data } = await generateAllowanceQuery({
        variables: {
          request: {
            currency,
            value: isAllow ? Number.MAX_SAFE_INTEGER.toString() : '0',
            [getCollectModuleConfig(selectedModule).type]: selectedModule
          }
        }
      })
      const generated = data?.generateModuleCurrencyApprovalData
      sendTransaction?.({
        recklesslySetUnpreparedRequest: {
          from: generated?.from,
          to: generated?.to,
          data: generated?.data
        }
      })
    } catch (error) {
      setLoadingModule('')
      logger.error('[Error Update Permission]', error)
    }
  }

  return (
    <div className="pt-6">
      <div>
        <h1 className="mb-1 text-xl font-semibold">Access permissions</h1>
        <p className="opacity-80">
          These are the collect modules which you allowed / need to allow to use
          collect feature. You can allow and revoke access anytime.
        </p>
      </div>
      <div>
        {!gettingSettings && data && (
          <div className="flex justify-end pt-3 pb-4 md:pt-0">
            <select
              placeholder="More about your stream"
              autoComplete="off"
              className="bg-white text-sm p-2.5 rounded-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {data?.enabledModuleCurrencies?.map((currency: Erc20) => (
                <option key={currency.address} value={currency.address}>
                  {currency.symbol}
                </option>
              ))}
            </select>
          </div>
        )}
        {gettingSettings && (
          <div className="grid h-24 place-items-center">
            <Loader />
          </div>
        )}
        {!gettingSettings &&
          data?.approvedModuleAllowanceAmount?.map(
            (moduleItem: ApprovedAllowanceAmount) =>
              collectModules.includes(moduleItem.module) && (
                <div
                  key={moduleItem.contractAddress}
                  className="flex items-center pb-4 rounded-md"
                >
                  <div className="flex-1">
                    <h6 className="text-base">Allow {moduleItem.module}</h6>
                    <p className="text-sm opacity-70">
                      {getCollectModuleConfig(moduleItem.module).description}
                    </p>
                  </div>
                  <div className="flex items-center flex-none ml-2 space-x-2">
                    {moduleItem?.allowance === '0x00' ? (
                      <Button
                        disabled={loadingModule === moduleItem.module}
                        loading={loadingModule === moduleItem.module}
                        onClick={() => handleClick(true, moduleItem.module)}
                      >
                        Allow
                      </Button>
                    ) : (
                      <Button
                        disabled={loadingModule === moduleItem.module}
                        onClick={() => handleClick(false, moduleItem.module)}
                        variant="danger"
                        loading={loadingModule === moduleItem.module}
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

export default ModulePermissions

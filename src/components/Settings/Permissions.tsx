import { useLazyQuery, useQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import usePersistStore from '@lib/store/persist'
import { WMATIC_TOKEN_ADDRESS } from '@utils/constants'
import { getCollectModuleConfig } from '@utils/functions/getCollectModule'
import {
  ALLOWANCE_SETTINGS_QUERY,
  GENERATE_ALLOWANCE_QUERY
} from '@utils/gql/queries'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ApprovedAllowanceAmount, Erc20 } from 'src/types'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'

const collectModules = [
  'FeeCollectModule',
  'TimedFeeCollectModule',
  'FeeFollowModule'
]

const Permissions = () => {
  const { selectedChannel } = usePersistStore()
  const [currency, setCurrency] = useState(WMATIC_TOKEN_ADDRESS)
  const [loadingModule, setLoadingModule] = useState('')

  const { data: txData, sendTransaction } = useSendTransaction({
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const {
    data,
    refetch,
    loading: gettingSettings
  } = useQuery(ALLOWANCE_SETTINGS_QUERY, {
    variables: {
      request: {
        currencies: [currency],
        followModules: ['FeeFollowModule'],
        collectModules: [
          'FreeCollectModule',
          'FeeCollectModule',
          'LimitedFeeCollectModule',
          'LimitedTimedFeeCollectModule',
          'TimedFeeCollectModule',
          'RevertCollectModule'
        ],
        referenceModules: ['FollowerOnlyReferenceModule']
      }
    },
    skip: !selectedChannel?.id
  })
  useWaitForTransaction({
    hash: txData?.hash,
    onSuccess() {
      toast.success('Permission updated')
      setLoadingModule('')
      refetch({
        request: {
          currencies: [currency],
          followModules: ['FeeFollowModule'],
          collectModules: [
            'FreeCollectModule',
            'FeeCollectModule',
            'LimitedFeeCollectModule',
            'LimitedTimedFeeCollectModule',
            'TimedFeeCollectModule',
            'RevertCollectModule'
          ],
          referenceModules: ['FollowerOnlyReferenceModule']
        }
      })
    },
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const [generateAllowanceQuery] = useLazyQuery(GENERATE_ALLOWANCE_QUERY)

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
      sendTransaction({
        request: {
          from: generated.from,
          to: generated.to,
          data: generated.data
        }
      })
    } catch (error) {
      console.log(error)
      setLoadingModule('')
    }
  }

  return (
    <div className="p-4 bg-white divide-y divide-gray-200 rounded-lg dark:divide-gray-900 dark:bg-black">
      <div className="mb-6">
        <h1 className="mb-1 text-xl font-semibold">Access permissions</h1>
        <p className="opacity-80">
          These are the collect modules which you allowed / need to allow to use
          collect feature. You can allow and revoke access anytime.
        </p>
      </div>
      <div>
        {!gettingSettings && data && (
          <div className="flex justify-end py-4">
            <select
              placeholder="More about your stream"
              autoComplete="off"
              className="bg-white text-sm p-2.5 rounded-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {data?.enabledModuleCurrencies?.map(
                (currency: Erc20, idx: number) => (
                  <option key={idx} value={currency.address}>
                    {currency.symbol}
                  </option>
                )
              )}
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
            (moduleItem: ApprovedAllowanceAmount, i: number) =>
              collectModules.includes(moduleItem.module) && (
                <div key={i} className="flex items-center pb-4 rounded-md">
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

export default Permissions

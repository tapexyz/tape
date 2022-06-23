import { useLazyQuery, useQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import usePersistStore from '@lib/store/persist'
import { WMATIC_TOKEN_ADDRESS } from '@utils/constants'
import {
  ALLOWANCE_SETTINGS_QUERY,
  GENERATE_ALLOWANCE_QUERY
} from '@utils/gql/queries'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ApprovedAllowanceAmount, Erc20 } from 'src/types'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'

const getFollowModule = (modules: ApprovedAllowanceAmount[]) => {
  return modules.find((el) => el.module === 'FeeFollowModule')
}

const Permissions = () => {
  const { selectedChannel } = usePersistStore()
  const [currency, setCurrency] = useState(WMATIC_TOKEN_ADDRESS)
  const [loading, setLoading] = useState(false)

  const { data: txData, sendTransaction } = useSendTransaction({
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
      setLoading(false)
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
        collectModules: ['FeeCollectModule'],
        referenceModules: ['FollowerOnlyReferenceModule']
      }
    },
    skip: !selectedChannel?.id
  })
  const { isLoading } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess() {
      toast.success('Permission updated')
      setLoading(false)
      refetch({
        request: {
          currencies: [currency],
          followModules: ['FeeFollowModule'],
          collectModules: ['FeeCollectModule'],
          referenceModules: ['FollowerOnlyReferenceModule']
        }
      })
    },
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const [generateAllowanceQuery] = useLazyQuery(GENERATE_ALLOWANCE_QUERY)

  const handleClick = (isAllow: boolean) => {
    setLoading(true)
    generateAllowanceQuery({
      variables: {
        request: {
          currency,
          value: isAllow ? '10000000' : '0',
          followModule: 'FeeFollowModule'
        }
      }
    })
      .then((result) => {
        const generated = result?.data?.generateModuleCurrencyApprovalData
        sendTransaction({
          request: {
            from: generated.from,
            to: generated.to,
            data: generated.data
          }
        })
      })
      .catch(() => setLoading(false))
  }

  return (
    <div className="p-4 bg-white divide-y divide-gray-200 rounded-lg dark:divide-gray-900 dark:bg-black">
      <div className="mb-6">
        <h1 className="mb-1 text-xl font-semibold">Access permissions</h1>
        <p className="text-xs opacity-80">
          These are the modules which you allowed to automatically debit funds
          from your account. You can see the information here and revoke access
          anytime.
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
                    {currency.name}
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
        {data && !gettingSettings && (
          <div className="flex items-center pb-2 rounded-md">
            <div className="flex-1">
              <h6 className="text-base">
                Allow{' '}
                {getFollowModule(data?.approvedModuleAllowanceAmount)?.module}
              </h6>
              <p className="text-xs opacity-70">
                Allows subscriber to join the channel by paying a fee specified
                by the channel owner.
              </p>
            </div>
            <div className="flex items-center flex-none ml-2 space-x-2">
              {getFollowModule(data?.approvedModuleAllowanceAmount)
                ?.allowance === '0x00' ? (
                <Button
                  disabled={isLoading || loading}
                  onClick={() => handleClick(true)}
                >
                  Allow
                </Button>
              ) : (
                <Button
                  disabled={isLoading || loading}
                  onClick={() => handleClick(false)}
                  variant="danger"
                >
                  Revoke
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Permissions

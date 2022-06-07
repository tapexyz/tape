import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import { LENSHUB_PROXY_ADDRESS, WMATIC_TOKEN_ADDRESS } from '@utils/constants'
import { isEmptyString } from '@utils/functions/isEmptyString'
import omitKey from '@utils/functions/omitKey'
import {
  MODULES_CURRENCY_QUERY,
  SET_FOLLOW_MODULE_TYPED_DATA_MUTATION
} from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import clsx from 'clsx'
import { utils } from 'ethers'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Erc20, Profile } from 'src/types'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
}

const Membership = ({ channel }: Props) => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    token: WMATIC_TOKEN_ADDRESS,
    amount: '',
    recipient: channel.ownedBy
  })

  const { signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
      setLoading(false)
    }
  })
  const { data: enabledCurrencies } = useQuery(MODULES_CURRENCY_QUERY, {
    variables: { request: { profileIds: channel?.id } },
    skip: !channel?.id
  })
  const { data: writtenData, write: writeFollow } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY_ADDRESS,
      contractInterface: LENSHUB_PROXY_ABI
    },
    'setFollowModuleWithSig',
    {
      onError(error: any) {
        setLoading(false)
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  )
  const { indexed } = usePendingTxn(writtenData?.hash || '')
  useEffect(() => {
    if (indexed) {
      setLoading(false)
      toast.success('Membership updated 🎉')
    }
  }, [indexed])

  const [setFollowModuleTypedData] = useMutation(
    SET_FOLLOW_MODULE_TYPED_DATA_MUTATION,
    {
      onCompleted(data) {
        const typedData = data.createSetFollowModuleTypedData.typedData
        const { profileId, followModule, followModuleInitData } =
          typedData?.value

        signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        }).then((signature) => {
          const { v, r, s } = utils.splitSignature(signature)
          writeFollow({
            args: {
              profileId,
              followModule,
              followModuleInitData,
              sig: { v, r, s, deadline: typedData.value.deadline }
            }
          })
        })
      },
      onError(error) {
        setLoading(false)
        toast.error(error.message)
      }
    }
  )

  const setMembership = () => {
    if (
      isEmptyString(form.recipient) ||
      isEmptyString(form.amount) ||
      isEmptyString(form.token)
    )
      return toast.error('Please fill out required fields.')
    setLoading(true)
    setFollowModuleTypedData({
      variables: {
        request: {
          profileId: channel?.id,
          followModule: {
            feeFollowModule: {
              amount: {
                currency: form.token.split('-')[0],
                value: form.amount
              },
              recipient: form.recipient
            }
          }
        }
      }
    })
  }

  return (
    <div className="p-3 bg-white rounded-md dark:bg-black">
      <div className="mb-6 md:mb-8">
        <h1 className="mb-1 text-lg font-semibold">Grow with Lens 🌿</h1>
        <p className="text-sm opacity-80">
          You can set up a subscription fee for your channel and provide
          exclusive offers and perks to the subscribers, also people can pay and
          support your work.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <div className="flex items-center mb-1 space-x-1.5">
            <div className="required text-[11px] font-semibold uppercase opacity-70">
              Currency
            </div>
          </div>
          <select
            placeholder="More about your stream"
            autoComplete="off"
            className={clsx(
              'bg-white text-sm px-2.5 py-1 rounded-md dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full'
            )}
            value={form.token}
            onChange={(e) => setForm({ ...form, token: e.target.value })}
          >
            {enabledCurrencies?.enabledModuleCurrencies?.map(
              (currency: Erc20, idx: number) => (
                <option
                  key={idx}
                  value={`${currency.address}-${currency.symbol}`}
                >
                  {currency.name}
                </option>
              )
            )}
          </select>
        </div>
        <div>
          <Input
            label="Amount"
            type="number"
            placeholder="100"
            autoComplete="off"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        <div>
          <Input
            label="Recipient"
            placeholder="0x00..."
            autoComplete="off"
            required
            value={form.recipient}
            onChange={(e) => setForm({ ...form, recipient: e.target.value })}
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={() => setMembership()} disabled={loading}>
          {loading ? 'Loading' : 'Set Membership'}
        </Button>
      </div>
    </div>
  )
}

export default Membership

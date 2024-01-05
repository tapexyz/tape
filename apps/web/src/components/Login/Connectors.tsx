import CheckOutline from '@components/Common/Icons/CheckOutline'
import WarningOutline from '@components/Common/Icons/WarningOutline'
import useProfileStore from '@lib/store/idb/profile'
import { Callout, Flex } from '@radix-ui/themes'
import { POLYGON_CHAIN_ID } from '@tape.xyz/constants'
import { Button } from '@tape.xyz/ui'
import React from 'react'
import type { Connector } from 'wagmi'
import { useAccount, useConnect } from 'wagmi'

import Authenticate from './Authenticate'
import Authenticated from './Authenticated'

const Connectors = () => {
  const { connector: connected } = useAccount()

  const { connectors, connectAsync, isLoading, error } = useConnect({
    chainId: POLYGON_CHAIN_ID
  })

  const { activeProfile } = useProfileStore()

  if (activeProfile?.id) {
    return <Authenticated />
  }

  const onChooseConnector = async (connector: Connector) => {
    try {
      await connectAsync({ connector })
    } catch {}
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {connectors.map((c) => (
          <Button
            key={c.id}
            variant="secondary"
            onClick={() => onChooseConnector(c)}
            disabled={c.id === connected?.id || isLoading}
          >
            <Flex justify="between" align="center" className="w-full">
              <span>{c.name}</span>
              {c.id === connected?.id && <CheckOutline className="size-3" />}
            </Flex>
          </Button>
        ))}
      </div>
      <Authenticate />
      {error?.message ? (
        <Callout.Root color="red">
          <Callout.Icon>
            <WarningOutline className="size-4" />
          </Callout.Icon>
          <Callout.Text highContrast>
            {error?.message ?? 'Failed to connect'}
          </Callout.Text>
        </Callout.Root>
      ) : null}
    </div>
  )
}

export default Connectors

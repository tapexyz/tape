import type { Connector } from 'wagmi'

import CheckOutline from '@components/Common/Icons/CheckOutline'
import WarningOutline from '@components/Common/Icons/WarningOutline'
import useProfileStore from '@lib/store/idb/profile'
import { Button, Callout, Flex } from '@radix-ui/themes'
import { POLYGON_CHAIN_ID } from '@tape.xyz/constants'
import React from 'react'
import { useAccount, useConnect } from 'wagmi'

import Authenticate from './Authenticate'
import Authenticated from './Authenticated'

const Connectors = () => {
  const { connector: connected } = useAccount()

  const { connectAsync, connectors, error, isLoading } = useConnect({
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
    <Flex className="py-10" direction="column" gap="6">
      <Flex direction="column" gap="2">
        {connectors.map((c) => (
          <Button
            disabled={c.id === connected?.id || isLoading}
            highContrast
            key={c.id}
            onClick={() => onChooseConnector(c)}
            variant="surface"
          >
            <Flex align="center" className="w-full" justify="between">
              <span>{c.name}</span>
              {c.id === connected?.id && <CheckOutline className="size-4" />}
            </Flex>
          </Button>
        ))}
      </Flex>
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
    </Flex>
  )
}

export default Connectors

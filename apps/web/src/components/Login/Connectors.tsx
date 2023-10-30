import CheckOutline from '@components/Common/Icons/CheckOutline'
import WarningOutline from '@components/Common/Icons/WarningOutline'
import useProfileStore from '@lib/store/profile'
import { Button, Callout, Flex } from '@radix-ui/themes'
import { POLYGON_CHAIN_ID } from '@tape.xyz/constants'
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
    <Flex className="py-10" direction="column" gap="6">
      <Flex direction="column" gap="3">
        {connectors.map((c) => (
          <Button
            key={c.id}
            highContrast
            variant="soft"
            onClick={() => onChooseConnector(c)}
            disabled={c.id === connected?.id || isLoading}
          >
            <Flex justify="between" align="center" className="w-full">
              <span>{c.name}</span>
              {c.id === connected?.id && <CheckOutline className="h-4 w-4" />}
            </Flex>
          </Button>
        ))}
      </Flex>
      <Authenticate />
      {error?.message ? (
        <Callout.Root color="red">
          <Callout.Icon>
            <WarningOutline className="h-4 w-4" />
          </Callout.Icon>
          <Callout.Text>{error?.message ?? 'Failed to connect'}</Callout.Text>
        </Callout.Root>
      ) : null}
    </Flex>
  )
}

export default Connectors

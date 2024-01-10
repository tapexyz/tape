import useProfileStore from '@lib/store/idb/profile'
import { POLYGON_CHAIN_ID } from '@tape.xyz/constants'
import { Button, Callout, CheckOutline, WarningOutline } from '@tape.xyz/ui'
import React, { memo } from 'react'
import type { Connector } from 'wagmi'
import { useAccount, useConnect } from 'wagmi'

import Authenticate from './Authenticate'

const Connectors = () => {
  const { activeProfile } = useProfileStore()

  const { connector: connected } = useAccount()
  const { connectors, connectAsync, isLoading, error } = useConnect({
    chainId: POLYGON_CHAIN_ID
  })

  if (activeProfile?.id) {
    return <Authenticate />
  }

  const onChooseConnector = async (connector: Connector) => {
    try {
      await connectAsync({ connector })
    } catch {}
  }

  const getConnectorName = (connector: Connector) => {
    switch (connector.id) {
      case 'walletConnect':
        return 'Other Wallets'
      default:
        return connector.name
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {connectors.map((c) => (
          <Button
            key={c.id}
            size="md"
            variant="secondary"
            onClick={() => onChooseConnector(c)}
            disabled={c.id === connected?.id || isLoading}
          >
            <div className="flex w-full items-center justify-between">
              <span>{getConnectorName(c)}</span>
              {c.id === connected?.id && <CheckOutline className="size-3" />}
            </div>
          </Button>
        ))}
      </div>
      <Authenticate />
      {error?.message ? (
        <Callout variant="danger" icon={<WarningOutline className="size-4" />}>
          {error?.message ?? 'Failed to connect'}
        </Callout>
      ) : null}
    </div>
  )
}

export default memo(Connectors)

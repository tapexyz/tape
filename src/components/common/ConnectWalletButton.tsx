import { Button } from '@components/ui/Button'
import { Loader } from '@components/ui/Loader'
import Modal from '@components/ui/Modal'
import useAppStore from '@lib/store'
import { POLYGON_CHAIN_ID } from '@utils/constants'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { BiError } from 'react-icons/bi'
import { Connector, useAccount, useConnect, useNetwork } from 'wagmi'

import UserMenu from './UserMenu'

type Props = {
  handleSign: () => void
  loading?: boolean
}

const ConnectWalletButton = ({ handleSign, loading }: Props) => {
  const { token } = useAppStore()
  const [showModal, setShowModal] = useState(false)
  const { data: accountData } = useAccount()
  const { connectAsync, isConnected, connectors, activeConnector, error } =
    useConnect()
  const { activeChain, switchNetwork } = useNetwork()
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  const onConnect = async (x: Connector) => {
    let connected = await connectAsync(x)
    if (connected?.account) setShowModal(false)
  }

  return (
    <div>
      <Modal
        title="Connect Wallet"
        panelClassName="max-w-lg !p-5"
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <div className="inline-block w-full mt-4 space-y-2 overflow-hidden text-left align-middle transition-all transform">
          {isConnected && (
            <div className="w-full p-4 space-y-2 border border-gray-300 rounded-lg dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h6 className="text-sm text-gray-600 dark:text-gray-400">
                  Connected with {activeConnector?.name}
                </h6>
                <span className="inline-block px-3 py-0.5 text-xs bg-gray-100 rounded-lg dark:bg-gray-800">
                  {activeChain?.name}
                </span>
              </div>
              <h6>{accountData?.address}</h6>
            </div>
          )}
          {connectors.map((x, i) => {
            return (
              <button
                key={i}
                className={clsx(
                  'w-full rounded-lg p-4 dark:bg-gray-900 bg-gray-100',
                  {
                    'hover:shadow-inner dark:hover:opacity-80':
                      x.id !== accountData?.connector?.id
                  }
                )}
                onClick={() => onConnect(x)}
                disabled={
                  isMounted
                    ? !x.ready || x.id === accountData?.connector?.id
                    : false
                }
              >
                <span className="flex items-center justify-between w-full">
                  {isMounted ? x.name : x.id === 'injected' ? x.id : x.name}
                  {isMounted ? !x.ready && ' (unsupported)' : ''}
                  {loading && x.name === activeConnector?.name && <Loader />}
                  {!loading && x.id === accountData?.connector?.id && (
                    <AiOutlineCheck className="w-5 h-5 text-green-800" />
                  )}
                </span>
              </button>
            )
          })}
          {error?.message ? (
            <div className="flex items-center px-1 py-2 text-red-500">
              <BiError className="w-5 h-5 mr-2" />
              {error?.message ?? 'Failed to connect'}
            </div>
          ) : null}
        </div>
      </Modal>
      {activeChain?.id === POLYGON_CHAIN_ID ? (
        token.refresh ? (
          <UserMenu />
        ) : (
          <Button
            loading={loading}
            onClick={() => handleSign()}
            disabled={loading}
          >
            Sign-in with Ethereum
          </Button>
        )
      ) : isConnected && switchNetwork ? (
        <Button
          onClick={() => switchNetwork(POLYGON_CHAIN_ID)}
          className="!text-white"
          variant="danger"
        >
          Wrong network
        </Button>
      ) : (
        <Button onClick={() => setShowModal(true)}>Connect Wallet</Button>
      )}
    </div>
  )
}

export default ConnectWalletButton

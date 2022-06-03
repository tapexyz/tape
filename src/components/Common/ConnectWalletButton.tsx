import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import { POLYGON_CHAIN_ID } from '@utils/constants'
import { getWalletLogo } from '@utils/functions/getWalletLogo'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { BiError } from 'react-icons/bi'
import { CgBrowser } from 'react-icons/cg'
import { Connector, useAccount, useConnect, useNetwork } from 'wagmi'

import UserMenu from './UserMenu'

type Props = {
  handleSign: () => void
  loading?: boolean
}

const ConnectWalletButton = ({ handleSign, loading }: Props) => {
  const { selectedChannel } = useAppStore()
  const [showModal, setShowModal] = useState(false)
  const { data: account } = useAccount()
  const {
    connectAsync,
    connectors,
    activeConnector,
    error,
    isConnecting,
    pendingConnector
  } = useConnect()
  const { activeChain, switchNetwork } = useNetwork()

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  const onConnect = async (x: Connector) => {
    await connectAsync(x).then(({ account }) => {
      if (account) setShowModal(false)
    })
  }

  return (
    <div>
      <Modal
        title="Connect Wallet"
        panelClassName="max-w-md"
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <div className="inline-block w-full mt-4 space-y-2 overflow-hidden text-left align-middle transition-all transform">
          {activeConnector && (
            <div className="w-full p-4 space-y-2 border border-gray-300 rounded-lg dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h6 className="text-sm text-gray-600 dark:text-gray-400">
                  Connected with {activeConnector?.name}
                </h6>
                <span className="inline-block px-3 py-0.5 text-xs bg-gray-100 rounded-lg dark:bg-gray-800">
                  {activeChain?.name}
                </span>
              </div>
              <h6 className="text-sm truncate">{account?.address}</h6>
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
                      x.id !== account?.connector?.id
                  }
                )}
                onClick={() => onConnect(x)}
                disabled={
                  isMounted
                    ? !x.ready || x.id === account?.connector?.id
                    : false
                }
              >
                <div className="flex items-center w-full space-x-2.5">
                  {x.id === 'injected' ? (
                    <CgBrowser className="text-xl text-green-900" />
                  ) : (
                    <img
                      src={getWalletLogo(x.id)}
                      className="w-5 h-5 rounded"
                      draggable={false}
                      alt=""
                    />
                  )}
                  <span className="flex items-center justify-between flex-1">
                    <span>
                      {isMounted
                        ? x.id === 'injected'
                          ? 'Browser Wallet'
                          : x.name
                        : x.name}
                      {isMounted ? !x.ready && ' (unsupported)' : ''}
                    </span>
                    <span>
                      {isConnecting && x.id === pendingConnector?.id && (
                        <Loader />
                      )}
                      {!loading && x.id === account?.connector?.id && (
                        <AiOutlineCheck className="w-5 h-5 text-green-800" />
                      )}
                    </span>
                  </span>
                </div>
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
      {account ? (
        activeChain?.id === POLYGON_CHAIN_ID ? (
          selectedChannel ? (
            <UserMenu />
          ) : (
            <Button
              loading={loading}
              onClick={() => handleSign()}
              disabled={loading}
            >
              Sign In
            </Button>
          )
        ) : (
          <Button
            onClick={() => switchNetwork && switchNetwork(POLYGON_CHAIN_ID)}
            variant="danger"
          >
            <span className="text-white">Wrong network</span>
          </Button>
        )
      ) : (
        <Button onClick={() => setShowModal(true)}>Connect Wallet</Button>
      )}
    </div>
  )
}

export default ConnectWalletButton

import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import Modal from '@components/UIElements/Modal'
import usePersistStore from '@lib/store/persist'
import { POLYGON_CHAIN_ID } from '@utils/constants'
import { getWalletInfo } from '@utils/functions/getWalletInfo'
import useIsMounted from '@utils/hooks/useIsMounted'
import clsx from 'clsx'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineCheck } from 'react-icons/ai'
import { BiError } from 'react-icons/bi'
import { BsThreeDots } from 'react-icons/bs'
import {
  Connector,
  useAccount,
  useConnect,
  useNetwork,
  useSwitchNetwork
} from 'wagmi'

import UserMenu from './UserMenu'

type Props = {
  handleSign: () => void
  signing?: boolean
}

const ConnectWalletButton = ({ handleSign, signing }: Props) => {
  const { isAuthenticated } = usePersistStore()
  const [showModal, setShowModal] = useState(false)
  const { address, connector, isConnecting, isConnected } = useAccount()
  const { connectAsync, connectors, error, pendingConnector } = useConnect()
  const { switchNetwork } = useSwitchNetwork({
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { chain } = useNetwork()

  const walletConnect = connectors.find((w) => w.id === 'walletConnect')

  const { mounted } = useIsMounted()

  const onConnect = async (x: Connector) => {
    await connectAsync({ connector: x }).then(({ account }) => {
      if (account) setShowModal(false)
    })
  }

  return (
    <>
      <Modal
        title="Connect Wallet"
        panelClassName="max-w-md"
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <div className="inline-block w-full mt-4 space-y-3 overflow-hidden text-left align-middle transition-all transform">
          {connector && (
            <div className="w-full p-4 space-y-2 border border-gray-300 rounded-lg dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h6 className="text-sm text-gray-600 dark:text-gray-400">
                  Connected with {connector?.name}
                </h6>
                <span className="inline-block px-3 py-0.5 text-xs bg-gray-100 rounded-lg dark:bg-gray-800">
                  {chain?.name}
                </span>
              </div>
              <h6 className="text-sm truncate">{address}</h6>
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            {connectors.map((wallet, i) => {
              return (
                getWalletInfo(wallet.id, wallet.name) && (
                  <button
                    key={i}
                    className={clsx(
                      'w-full relative flex space-y-3 items-center flex-col rounded-lg p-4 dark:bg-gray-900 bg-gray-100',
                      {
                        'hover:shadow-inner dark:hover:opacity-80':
                          wallet.id !== connector?.id
                      }
                    )}
                    onClick={() => onConnect(wallet)}
                    disabled={
                      mounted
                        ? !wallet.ready || wallet.id === connector?.id
                        : false
                    }
                  >
                    <div className="flex items-center">
                      <img
                        src={getWalletInfo(wallet.id, wallet.name)?.logo}
                        className="rounded-md w-7 h-7"
                        draggable={false}
                        alt="icon"
                      />
                    </div>
                    <div className="flex items-center justify-between flex-1 text-xs">
                      <span>
                        {getWalletInfo(wallet.id, wallet.name)?.label}
                        {mounted ? !wallet.ready && ' (unsupported)' : ''}
                      </span>
                      <span>
                        {isConnecting && wallet.id === pendingConnector?.id && (
                          <span className="absolute top-2 right-2">
                            <Loader size="sm" />
                          </span>
                        )}
                        {!signing && wallet.id === connector?.id && (
                          <span className="absolute top-2 right-2">
                            <AiOutlineCheck className="text-indigo-800" />
                          </span>
                        )}
                      </span>
                    </div>
                  </button>
                )
              )
            })}
          </div>
          {walletConnect && (
            <button
              className={clsx(
                'w-full space-x-2 flex justify-center items-center rounded-lg p-4 dark:bg-gray-900 bg-gray-100'
              )}
              onClick={() => onConnect(walletConnect)}
            >
              <span>
                <BsThreeDots />
              </span>
              <div className="flex items-center justify-between text-xs">
                <span>Other wallets</span>
                <span>
                  {isConnecting &&
                    walletConnect.id === pendingConnector?.id && <Loader />}
                  {!signing && walletConnect.id === connector?.id && (
                    <AiOutlineCheck className="text-indigo-800" />
                  )}
                </span>
              </div>
            </button>
          )}

          {error?.message ? (
            <div className="flex items-center px-1 pt-2 text-red-500">
              <BiError className="w-5 h-5 mr-2" />
              {error?.message ?? 'Failed to connect'}
            </div>
          ) : null}
        </div>
      </Modal>
      {connector?.id && isConnected ? (
        chain?.id === POLYGON_CHAIN_ID ? (
          isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button
              loading={signing}
              onClick={() => handleSign()}
              disabled={signing}
            >
              Sign In
              <span className="hidden ml-1 md:inline-block">with Ethereum</span>
            </Button>
          )
        ) : (
          <Button
            onClick={() => switchNetwork && switchNetwork(POLYGON_CHAIN_ID)}
            variant="danger"
          >
            <span className="text-white">Switch network</span>
          </Button>
        )
      ) : (
        <Button onClick={() => setShowModal(true)}>
          Connect
          <span className="hidden ml-1 md:inline-block">Wallet</span>
        </Button>
      )}
    </>
  )
}

export default ConnectWalletButton

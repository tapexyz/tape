import { useQuery } from '@apollo/client'
import SquareButtonShimmer from '@components/Shimmers/SquareButtonShimmer'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import { POLYGON_CHAIN_ID } from '@utils/constants'
import { getWalletInfo } from '@utils/functions/getWalletInfo'
import { CURRENT_USER_QUERY } from '@utils/gql/queries'
import useIsMounted from '@utils/hooks/useIsMounted'
import clsx from 'clsx'
import React, { useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { BiError } from 'react-icons/bi'
import { BsThreeDots } from 'react-icons/bs'
import { Profile } from 'src/types'
import { Connector, useAccount, useConnect, useNetwork } from 'wagmi'

import UserMenu from './UserMenu'

type Props = {
  handleSign: () => void
  signing?: boolean
}

const ConnectWalletButton = ({ handleSign, signing }: Props) => {
  const { selectedChannel, isAuthenticated, setSelectedChannel, setChannels } =
    useAppStore()
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
  const { loading } = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: account?.address },
    skip: !isAuthenticated || !account?.address,
    onCompleted(data) {
      const channels: Profile[] = data?.profiles?.items
      if (channels.length === 0) {
        setSelectedChannel(null)
      } else {
        setChannels(channels)
        setSelectedChannel(channels[0])
      }
    }
  })
  const walletConnect = connectors.find((w) => w.id === 'walletConnect')

  const isMounted = useIsMounted()

  const onConnect = async (x: Connector) => {
    await connectAsync(x).then(({ account }) => {
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
                          wallet.id !== account?.connector?.id
                      }
                    )}
                    onClick={() => onConnect(wallet)}
                    disabled={
                      isMounted()
                        ? !wallet.ready || wallet.id === account?.connector?.id
                        : false
                    }
                  >
                    <div className="flex items-center">
                      <img
                        src={getWalletInfo(wallet.id, wallet.name)?.logo}
                        className="rounded-md w-7 h-7"
                        draggable={false}
                        alt=""
                      />
                    </div>
                    <div className="flex items-center justify-between flex-1 text-xs">
                      <span>
                        {getWalletInfo(wallet.id, wallet.name)?.label}
                        {isMounted() ? !wallet.ready && ' (unsupported)' : ''}
                      </span>
                      <span>
                        {isConnecting && wallet.id === pendingConnector?.id && (
                          <span className="absolute top-2 right-2">
                            <Loader size="sm" />
                          </span>
                        )}
                        {!signing && wallet.id === account?.connector?.id && (
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
                  {!signing && walletConnect.id === account?.connector?.id && (
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
      {isMounted() && !loading ? (
        activeConnector?.id ? (
          activeChain?.id === POLYGON_CHAIN_ID ? (
            selectedChannel ? (
              <UserMenu />
            ) : (
              <Button
                loading={signing}
                onClick={() => handleSign()}
                disabled={signing}
              >
                Sign In with Ethereum
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
        )
      ) : (
        <SquareButtonShimmer />
      )}
    </>
  )
}

export default ConnectWalletButton

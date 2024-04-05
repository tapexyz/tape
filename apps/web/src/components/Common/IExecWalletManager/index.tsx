import { zodResolver } from '@hookform/resolvers/zod'
import { useDid } from '@hooks/useDid'
import type { SetSubscriptionParams } from '@iexec/dataprotector'
import type IExecWalletCreate from '@lib/iexec/walletCreate'
import {
  createWallet,
  generateSignatureChallenge,
  getCollectionTokenId,
  getIExec,
  getWalletAddress
} from '@lib/iexec/walletProvider'
import WalletType from '@lib/iexec/walletType'
import useProfileStore from '@lib/store/idb/profile'
import { TAPE_APP_NAME } from '@tape.xyz/constants'
import { shortenAddress } from '@tape.xyz/generic'
import {
  Badge as BadgeUI,
  Button,
  ExternalOutline,
  Input,
  Modal
} from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAccount, useSignMessage } from 'wagmi'
import { object, string, type z } from 'zod'

import IExecExplorerLink from '../Links/IExecExplorerLink'

type Props = {
  walletType: WalletType
  onWalletCreated?: Function
}

const formSchema = object({
  password: string().refine((pwd) => pwd.length > 6, {
    message: 'Invalid address'
  })
})
type FormData = z.infer<typeof formSchema>

const Entry = ({
  address,
  removingAddress,
  onRemove
}: {
  address: string
  removingAddress: string
  onRemove: (address: string) => void
}) => {
  const { did } = useDid({ address })
  return (
    <div
      key={address}
      className="tape-border rounded-small flex items-center justify-between px-4 py-3"
    >
      <div>
        <span className="font-bold">{did || shortenAddress(address)}</span>
        <IExecExplorerLink address={address}>
          <div className="flex items-center gap-1">
            <span>{shortenAddress(address)}</span>
            <ExternalOutline className="size-3" />
          </div>
        </IExecExplorerLink>
      </div>
      <Button
        onClick={() => onRemove(address)}
        disabled={removingAddress === address}
        color="red"
        variant="secondary"
      >
        Remove
      </Button>
    </div>
  )
}

const IExecWalletProvider: FC<Props> = ({ walletType, onWalletCreated }) => {
  const [walletCreated, setWalletCreate] = useState(false)
  const [walletInfo, setWalletInfo] = useState<IExecWalletCreate | undefined>()

  const [removingAddress, setRemovingAddress] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [buttonText, setButtonText] = useState('Save')
  const [subscriptionFee, setSubscriptionFee] = useState(5)

  const { address, isConnected } = useAccount()
  const { signMessage } = useSignMessage()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const activeProfile = useProfileStore((state) => state.activeProfile)
  const iExecWalletAddress = getWalletAddress(walletType, activeProfile)

  const onConfirmationModalChange = (shown: boolean) => {
    if (
      false == shown &&
      onWalletCreated &&
      getWalletAddress(walletType, activeProfile)
    ) {
      onWalletCreated.call(this, getWalletAddress(walletType, activeProfile))
    }
    setShowConfirmationModal(shown)
  }

  const addManager = async () => {
    toast.loading('Requesting signature to use your iExec Manager')
    let messageToSign = generateSignatureChallenge(
      activeProfile?.ownedBy.address
    )
    signMessage(
      { message: messageToSign },
      {
        onSuccess: async (signature) => {
          let createWalletResult: IExecWalletCreate = await createWallet(
            walletType,
            activeProfile,
            signature
          )
          toast.success('Wallet created!')
          setWalletCreate(true)
          setWalletInfo(createWalletResult)
          setShowModal(false)
          setShowConfirmationModal(true)
        }
      }
    )
  }

  const removeManager = async (address: string) => {}

  const updateSettings = async () => {
    toast.loading('Requesting signature to use your iExec Manager')
    let messageToSign = generateSignatureChallenge(
      activeProfile?.ownedBy.address
    )
    signMessage(
      { message: messageToSign },
      {
        onSuccess: async (signature) => {
          let iexec = getIExec(
            WalletType.CONTENT_PUBLISHER,
            activeProfile,
            signature
          )
          let subscriptionParams: SetSubscriptionParams = {
            collectionTokenId: getCollectionTokenId(activeProfile, signature),
            priceInNRLC: 10 * Math.pow(10, 9),
            durationInSeconds: 30 * 24 * 3600
          }

          await iexec?.sharing.setSubscriptionParams(subscriptionParams)
          toast.success('Subscription settings saved!')
        }
      }
    )
  }

  return (
    <div>
      {walletType == WalletType.CONTENT_PUBLISHER ? (
        <div>
          When you upload your content to {TAPE_APP_NAME}, you can chose to
          protect it and make it only accessible to those who pay a fee.
          Payments in $RLC tokens will be sent to your wallet below on the iExec
          chain. `
        </div>
      ) : null}
      {walletType == WalletType.CONTENT_CONSUMER ? (
        <div>
          This wallet will allow you to access protected content on{' '}
          {TAPE_APP_NAME}. You will need some $RLC tokens available in this
          wallet on the iExec chain in order to rent, subscribe or purchase
          protected content. `
        </div>
      ) : null}
      {!iExecWalletAddress ? (
        <div className="flex items-center justify-between space-x-2">
          <div>
            &nbsp;
            <center>
              <Button onClick={() => addManager()}>Create Wallet</Button>
            </center>
          </div>

          <Modal
            title="Create Wallet"
            description="Your password will be required next time to unlock your Protected Content Manager on this browser. Please remember it as it will not be communicated back to you."
            show={showModal}
            setShow={setShowModal}
          >
            <form onSubmit={handleSubmit(addManager)}>
              <Input
                label="Password"
                type="password"
                placeholder="Enter a password to secure the new wallet"
                {...register('password')}
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    reset()
                    setShowModal(false)
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button disabled={submitting} loading={submitting}>
                  Submit
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      ) : null}

      <Modal
        title="Wallet created!"
        description="⚠️Warning: This passphrase is essential to recover your crypto wallet. Ensure you write it down and safeguard it carefully. It must remain confidential and should not be shared with anyone."
        show={showConfirmationModal}
        setShow={onConfirmationModalChange}
      >
        <br />
        {walletInfo?.passphrase
          .split(' ')
          .slice(0, 5)
          .map((word, index) => (
            <span key={'spn' + index}>
              <BadgeUI
                title={word}
                key={'bdg' + index}
                size="lg"
                className="!text-black"
              >
                #{index}&nbsp;{word}
              </BadgeUI>
              &nbsp;
            </span>
          ))}
        <br />
        <br />
        {walletInfo?.passphrase
          .split(' ')
          .slice(5, 10)
          .map((word, index) => (
            <span key={'spn' + (index + 5)}>
              <BadgeUI
                title={word}
                key={'bdg' + (index + 5)}
                size="lg"
                className="!text-black"
              >
                #{index + 5}&nbsp;{word}
              </BadgeUI>
              &nbsp;
            </span>
          ))}
        <br />
        <br />
        {walletInfo?.passphrase
          .split(' ')
          .slice(10, 12)
          .map((word, index) => (
            <span key={'spn' + (index + 10)}>
              <BadgeUI
                title={word}
                key={'bdg' + (index + 10)}
                size="lg"
                className="!text-black"
              >
                #{index + 10}&nbsp;{word}
              </BadgeUI>
              &nbsp;
            </span>
          ))}
      </Modal>

      <div className="mt-3">
        {iExecWalletAddress ? (
          <div className="mt-4 grid gap-3 md:grid-cols-1">
            <Entry
              key={iExecWalletAddress}
              address={iExecWalletAddress}
              removingAddress={removingAddress}
              onRemove={(address) => removeManager(address)}
            />
          </div>
        ) : null}

        {iExecWalletAddress && walletType == WalletType.CONTENT_PUBLISHER ? (
          <div className="items-center gap-1">
            <br />
            <div className="flex items-center gap-1">
              <Input
                label="What is the monthly subscription fee for your protected content collection?"
                placeholder="0.1"
                min="0.00"
                step="0.01"
                type="number"
                onChange={(evt) => {
                  setSubscriptionFee(
                    Number(evt.target.value.replace(/\+|-/gi, ''))
                  )
                }}
              />
            </div>
            <p></p>
            <Button disabled={submitting} loading={submitting}>
              {buttonText}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default IExecWalletProvider

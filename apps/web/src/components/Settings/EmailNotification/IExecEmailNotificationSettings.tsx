import { getWalletAddress } from '@lib/iexec/walletProvider'
import WalletType from '@lib/iexec/walletType'
import useProfileStore from '@lib/store/idb/profile'
import React, { useState } from 'react'

const IExecEmailNotificationSettings = () => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const [walletAddress, setWalletAddress] = useState(
    getWalletAddress(WalletType.EMAIL_NOTIFICATION, activeProfile)
  )

  const getDescription = () => {
    return !walletAddress
      ? `Protect your email address and select the email notifications that you'd like to receive.`
      : null

    //TODO: handle the fact that the wallet is created or not
    //if (!activeProfile?.signless) {
    //  return `Enable your Lens manager for seamless interaction with ${TAPE_APP_NAME}, allowing for faster and easier transactions without the need for signing.`
    // }
    // return `Lens manager helps interact with ${TAPE_APP_NAME} without signing any of your transactions.`
  }

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="mb-2 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">
          Email Notifications
        </h1>
        <p className="opacity-80">
          {getDescription()}
          Email notifications are powered by{' '}
          <img
            className="iexec-logo-inline"
            src="data:image/png;base64,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"
          />
        </p>
      </div>
    </div>
  )
}

export default IExecEmailNotificationSettings

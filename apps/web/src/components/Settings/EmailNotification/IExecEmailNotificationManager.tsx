import IExecWalletProvider from '@components/Common/IExecWalletManager'
import { zodResolver } from '@hookform/resolvers/zod'
import type {
  GetProtectedDataParams,
  GrantAccessParams,
  IExecDataProtector,
  ProtectedData,
  ProtectedDataWithSecretProps,
  TransferParams
} from '@iexec/dataprotector'
import {
  generateSignatureChallenge,
  getIExec,
  getIExecReadOnly,
  getWalletAddress
} from '@lib/iexec/walletProvider'
import WalletType from '@lib/iexec/walletType'
import useProfileStore from '@lib/store/idb/profile'
import {
  DEFAULT_AUTHORIZATION_VOLUME,
  EMAIL_NOTIFICATION_IEXEC_SENDER,
  EMAIL_NOTIFICATION_PLATFORM_SENDER,
  EMAIL_NOTIFICATION_PROMOTIONS_SENDER,
  TAPE_APP_NAME,
  WEB3MAIL_DAPP_ADDRESS
} from '@tape.xyz/constants'
import { Button, Input, Modal, Switch } from '@tape.xyz/ui'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSignMessage } from 'wagmi'
import { object, string, type z } from 'zod'

const formSchema = object({
  email: string().refine((em) => em.length > 3, {
    message: 'Invalid email'
  })
})
type FormData = z.infer<typeof formSchema>

const IExecEmailNotificationManager = () => {
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  type NotificationSettings = {
    subscription: boolean
    rental: boolean
    buying: boolean

    commentReply: boolean
    sharedContent: boolean

    promotion: boolean
    platformUpdate: boolean
    providerUpdate: boolean
    reward: number
  }

  const NOTIFICATION_SETTING_DEFAULTS: NotificationSettings = {
    subscription: false,
    rental: false,
    buying: false,

    commentReply: false,
    sharedContent: false,

    promotion: false,
    platformUpdate: false,
    providerUpdate: false,
    reward: 0
  }

  const [notificationSettings, setNotificationSettings] = useState(
    NOTIFICATION_SETTING_DEFAULTS
  )

  const [removingAddress, setRemovingAddress] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [buttonText, setButtonText] = useState('Protect & Grant access')
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const [iExecWalletAddress, setIExecWalletAddress] = useState(
    getWalletAddress(WalletType.EMAIL_NOTIFICATION, activeProfile)
  )
  const { signMessage } = useSignMessage()

  const save = () => {
    setShowModal(true)
  }

  const resetModals = () => {
    setButtonText('Protect & Grant Access')
  }

  const onWalletCreated = (walletAddress: string) => {
    setIExecWalletAddress(walletAddress)
  }

  const getExistingSettings = async (): Promise<
    ProtectedData[] | undefined
  > => {
    let iexec: IExecDataProtector | undefined = getIExecReadOnly()

    if (!iexec) {
      return
    }

    let ret: ProtectedData[] | undefined
    if (iExecWalletAddress) {
      let getProtectedDataParam: GetProtectedDataParams = {
        owner: iExecWalletAddress,
        requiredSchema: {
          'referrerPlatform-TAPE': 'string',
          notificationPreferences: 'string',
          [`referrerOwner-${activeProfile?.ownedBy.address}`]: 'string'
        }
      }

      ret = await iexec.core.getProtectedData(getProtectedDataParam)
    }

    return ret
  }

  const getLastSetting = async (): Promise<ProtectedData | undefined> => {
    let existingPreferences: ProtectedData[] | undefined =
      await getExistingSettings()
    return existingPreferences && existingPreferences.length > 0
      ? existingPreferences[0]
      : undefined
  }

  const createProtectedData = async ({ email }: FormData) => {
    setSubmitting(true)
    let messageToSign = generateSignatureChallenge(
      activeProfile?.ownedBy.address
    )
    signMessage(
      { message: messageToSign },
      {
        onSuccess: async (signature) => {
          try {
            let iexec: IExecDataProtector | undefined = getIExec(
              WalletType.EMAIL_NOTIFICATION,
              activeProfile,
              signature
            )
            if (!iexec) {
              alert('IExecDataProtector could not be instantiated ')
              setSubmitting(false)
              return
            }
            let existingPreferences: ProtectedData[] | undefined =
              await getExistingSettings()

            if (existingPreferences && existingPreferences.length > 0) {
              setButtonText('Removing previous authorisations...')

              // TODO: how to transfer to 0x0 address ?
              for (var i = 0; i < existingPreferences.length; i++) {
                let data = existingPreferences[i]
                let transferParams: TransferParams = {
                  protectedData: data.address,
                  newOwner: '0x92077bB7DC20854E54D5a7B2029fBA1CBC030464'
                }
                let transferResult =
                  await iexec.core.transferOwnership(transferParams)
              }
            }

            let protectDataParam = {
              data: {
                email: email,
                notificationPreferences: '',
                [`referrerPlatform-TAPE`]: '',
                [`referrerOwner-${activeProfile?.ownedBy.address}`]: ''
              }
            }

            if (notificationSettings.buying) {
              protectDataParam.data = {
                ...protectDataParam.data,
                ...{ [`notificationBuying`]: 'void' }
              }
            }
            if (notificationSettings.commentReply) {
              protectDataParam.data = {
                ...protectDataParam.data,
                ...{ [`notificationCommentReply`]: 'void' }
              }
            }
            if (notificationSettings.platformUpdate) {
              protectDataParam.data = {
                ...protectDataParam.data,
                ...{ [`notificationPlatformUpdate`]: 'void' }
              }
            }
            if (notificationSettings.promotion) {
              protectDataParam.data = {
                ...protectDataParam.data,
                ...{ [`notificationPromotion`]: 'void' }
              }
            }
            if (notificationSettings.providerUpdate) {
              protectDataParam.data = {
                ...protectDataParam.data,
                ...{ [`notificationProviderUpdate`]: 'void' }
              }
            }
            if (notificationSettings.rental) {
              protectDataParam.data = {
                ...protectDataParam.data,
                ...{ [`notificationRental`]: 'void' }
              }
            }
            if (notificationSettings.sharedContent) {
              protectDataParam.data = {
                ...protectDataParam.data,
                ...{ [`notificationSharedContent`]: 'void' }
              }
            }
            if (notificationSettings.subscription) {
              protectDataParam.data = {
                ...protectDataParam.data,
                ...{ [`notificationSubscription`]: 'void' }
              }
            }

            let result: ProtectedDataWithSecretProps =
              await iexec.core.protectData(protectDataParam)

            if (notificationSettings.promotion) {
              setButtonText('Authorizing promotion emails')
              let grantPromotionParams: GrantAccessParams = {
                protectedData: result.address,
                authorizedApp: WEB3MAIL_DAPP_ADDRESS,
                authorizedUser: EMAIL_NOTIFICATION_PROMOTIONS_SENDER,
                pricePerAccess: notificationSettings.reward * Math.pow(10, 9),
                numberOfAccess: DEFAULT_AUTHORIZATION_VOLUME
              }
              let grantedAccess =
                await iexec.core.grantAccess(grantPromotionParams)
            }

            if (
              notificationSettings.platformUpdate ||
              notificationSettings.commentReply ||
              notificationSettings.buying ||
              notificationSettings.rental ||
              notificationSettings.subscription ||
              notificationSettings.sharedContent
            ) {
              setButtonText('Authorizing platform updates emails...')
              let platformUpdate: GrantAccessParams = {
                protectedData: result.address,
                authorizedApp: WEB3MAIL_DAPP_ADDRESS,
                authorizedUser: EMAIL_NOTIFICATION_PLATFORM_SENDER,
                pricePerAccess: 0,
                numberOfAccess: DEFAULT_AUTHORIZATION_VOLUME
              }
              let grantedAccess = await iexec.core.grantAccess(platformUpdate)
            }

            if (notificationSettings.providerUpdate) {
              setButtonText('Authorizing iExec updates emails...')
              let grantProvider: GrantAccessParams = {
                protectedData: result.address,
                authorizedApp: WEB3MAIL_DAPP_ADDRESS,
                authorizedUser: EMAIL_NOTIFICATION_IEXEC_SENDER,
                pricePerAccess: 0,
                numberOfAccess: DEFAULT_AUTHORIZATION_VOLUME
              }
              let grantedAccess = await iexec.core.grantAccess(grantProvider)
            }

            setSubmitting(false)
            setShowModal(false)
            setShowConfirmationModal(true)
            resetModals()
          } catch (e) {
            console.log(e)
          }
        }
      }
    )
  }

  const removeManager = async (address: string) => {}

  useEffect(() => {
    getLastSetting().then((protectedData) => {
      let notifsettings: NotificationSettings = {
        subscription:
          protectedData && protectedData.schema.notificationSubscription
            ? true
            : false,
        rental:
          protectedData && protectedData.schema.notificationRental
            ? true
            : false,
        buying:
          protectedData && protectedData.schema.notificationBuying
            ? true
            : false,

        commentReply:
          protectedData && protectedData.schema.notificationCommentReply
            ? true
            : false,
        sharedContent:
          protectedData && protectedData.schema.notificationSharedContent
            ? true
            : false,

        promotion:
          protectedData && protectedData.schema.notificationPromotion
            ? true
            : false,
        platformUpdate:
          protectedData && protectedData.schema.notificationPlatformUpdate
            ? true
            : false,
        providerUpdate:
          protectedData && protectedData.schema.notificationProviderUpdate
            ? true
            : false,
        reward: 0
      }

      setNotificationSettings(notifsettings)
    })
  }, [])

  return (
    <>
      <IExecWalletProvider
        walletType={WalletType.EMAIL_NOTIFICATION}
        onWalletCreated={onWalletCreated}
      />
      {iExecWalletAddress ? (
        <>
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-1 flex-col justify-between">
              <Modal
                title={
                  'Email address' +
                  (notificationSettings.promotion
                    ? ' and inbox rewards 💰'
                    : '')
                }
                description="Your email address will be securely encrypted and protected using iExec. This ensures your privacy and security, keeping your email safe from unauthorized access or breaches."
                show={showModal}
                setShow={setShowModal}
              >
                <form onSubmit={handleSubmit(createProtectedData)}>
                  <Input
                    label="Email address"
                    placeholder="alice@ethereum.org"
                    type="email"
                    {...register('email')}
                  />
                  {notificationSettings.promotion ? (
                    <>
                      <span className="leading-normal">
                        <br />
                        You've opted to turn your inbox into an earning
                        opportunity 😎!
                      </span>
                      <div className="text-sm ">
                        <Input
                          label="$RLC reward per promotion email"
                          placeholder="0.1"
                          min="0.00"
                          step="0.01"
                          type="number"
                          onChange={(evt) => {
                            setNotificationSettings({
                              ...notificationSettings,
                              reward: Number(
                                evt.target.value.replace(/\+|-/gi, '')
                              )
                            })
                          }}
                        />
                      </div>
                    </>
                  ) : null}

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
                      {buttonText}
                    </Button>
                  </div>
                </form>
              </Modal>

              <div>
                <div className="mt-4">
                  <h2 className="text-lg capitalize">
                    Protected Content Monetization Notifications
                  </h2>
                  <div className="mt-4">
                    <Switch
                      size="sm"
                      label="Subscriptions"
                      checked={notificationSettings.subscription || false}
                      onCheckedChange={(val) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          subscription: val
                        })
                      }}
                    />
                    <span className="text-sm">
                      Notify me when someone buys a subscription to my protected
                      content collection
                    </span>
                  </div>
                  <div className="mt-4">
                    <Switch
                      size="sm"
                      label="Purchases"
                      checked={notificationSettings.buying || false}
                      onCheckedChange={(val) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          buying: val
                        })
                      }}
                    />
                    <span className="text-sm">
                      Notify me when someone buys access to a protected content
                      from my collection
                    </span>
                  </div>
                  <div className="mt-4">
                    <Switch
                      size="sm"
                      label="Rentals"
                      checked={notificationSettings.rental || false}
                      onCheckedChange={(val) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          rental: val
                        })
                      }}
                    />
                    <span className="text-sm">
                      Notify me when someone rents a protected content from my
                      collection
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-lg capitalize">
                    User Engagement Notifications
                  </h2>
                  <div className="mt-4">
                    <Switch
                      size="sm"
                      label="Comment replies"
                      checked={notificationSettings.commentReply || false}
                      onCheckedChange={(val) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          commentReply: val
                        })
                      }}
                    />
                    <span className="text-sm">
                      Notify me when someone adds a comment to my post
                    </span>
                  </div>
                  <div className="mt-4">
                    <Switch
                      size="sm"
                      label="Shared content"
                      checked={notificationSettings.sharedContent || false}
                      onCheckedChange={(val) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          sharedContent: val
                        })
                      }}
                    />
                    <span className="text-sm">
                      Notify me when someone shares my content
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-lg capitalize">
                    Platform update and email offers
                  </h2>
                  <div className="mt-4">
                    <Switch
                      size="sm"
                      label={TAPE_APP_NAME + ' platform updates'}
                      checked={notificationSettings.platformUpdate || false}
                      onCheckedChange={(val) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          platformUpdate: val
                        })
                      }}
                    />
                    <span className="text-sm">
                      I would like to receive {TAPE_APP_NAME} features and
                      platform updates
                    </span>
                  </div>
                  <div className="mt-4">
                    <Switch
                      size="sm"
                      label="iExec Updates"
                      checked={notificationSettings.providerUpdate || false}
                      onCheckedChange={(val) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          providerUpdate: val
                        })
                      }}
                    />
                    <span className="text-sm">
                      I would like to receive communication from iExec
                    </span>
                  </div>
                  <div className="mt-4">
                    <Switch
                      size="sm"
                      label="Partner offers"
                      checked={notificationSettings.promotion || false}
                      onCheckedChange={(val) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          promotion: val
                        })
                      }}
                    />
                    <span className="text-sm">
                      I would like to monetize my inbox with promotion emails
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full items-center justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              disabled={false}
              onClick={() => {
                console.log('Todo Call on cancel')
              }}
            >
              Reset
            </Button>
            <Button
              loading={submitting}
              disabled={submitting}
              type="submit"
              onClick={() => {
                save()
              }}
            >
              Save
            </Button>
          </div>
        </>
      ) : null}

      <Modal
        title="Preferences saved!"
        description="⚠️ Rest easy! Your email and notification preferences are shielded with iExec Data Protector, ensuring your choices are locked in safely and securely."
        show={showConfirmationModal}
        setShow={setShowConfirmationModal}
      >
        &nbsp;
      </Modal>
    </>
  )
}

export default IExecEmailNotificationManager

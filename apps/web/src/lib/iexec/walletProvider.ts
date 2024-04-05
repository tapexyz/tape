import {
  type CreateCollectionResponse,
  type DataProtectorConfigOptions,
  getWeb3Provider,
  IExecDataProtector
} from '@iexec/dataprotector'
import type { Profile } from '@tape.xyz/lens'
import { ethers } from 'ethers'
import { IExec, utils as IExecCoreUtils } from 'iexec'

import { decryptWithSignature, encryptWithSignature } from './crypto'
import type { EncryptedWallet } from './EncryptedWallet'
import type IExecWalletPrivateInfo from './IExecWalletPrivateInfo'
import { generateKeyPair, privateAsPem } from './rsa'
import type IExecWalletCreate from './walletCreate'
import WalletType from './walletType'
const HOST = 'https://bellecour.iex.ec'
const ENVIRONMENT = 'PROD'

function getItemKey(ownerAddress: string): string {
  return `iexec_${ownerAddress}`
}

const SIGNATURE_CHALLENGE_PREFIX = 'iExec Wallet for '

export const generateSignatureChallenge = (walletAddress: string) => {
  return SIGNATURE_CHALLENGE_PREFIX + walletAddress
}

export const isOwner = (
  item: EncryptedWallet | undefined,
  activeProfile: Profile | null
): boolean => {
  return true
}

export const getIExecCore = (privateKey: string): IExec => {
  try {
    let options =
      ENVIRONMENT == 'PROD'
        ? undefined
        : {
            smsURL: 'https://sms.scone-prod.stagingv8.iex.ec',
            iexecGatewayURL: 'https://api.market.stagingv8.iex.ec'
          }

    const ethProvider = IExecCoreUtils.getSignerFromPrivateKey(HOST, privateKey)
    return new IExec(
      {
        ethProvider
      },
      options
    )
  } catch (e: any) {
    throw Error(`Failed to get iexec: ${e.toString()}`)
  }
}

export const createStorageToken = async (address: string, pk: string) => {
  const iExecCore = getIExecCore(pk)
  const isIpfsStorageInitialized =
    await iExecCore.storage.checkStorageTokenExists(address)
  if (!isIpfsStorageInitialized) {
    const ipfsToken = await iExecCore.storage.defaultStorageLogin()
    const { isPushed } = await iExecCore.storage.pushStorageToken(ipfsToken, {
      forceUpdate: true
    })
  }
}

export const createBeneficiaryKeys = async (pk: string) => {
  const { publicKey, privateKey } = await generateKeyPair()
  const iExecCore = getIExecCore(pk)
  await iExecCore.result.pushResultEncryptionKey(publicKey, {
    forceUpdate: true
  })

  return privateAsPem(privateKey)
}

const getStoreItem = (
  walletType: WalletType,
  ownerAddress: string
): EncryptedWallet | undefined => {
  let items: [EncryptedWallet] | undefined = undefined
  let item: EncryptedWallet | undefined = undefined

  let localStorageitemKey = getItemKey(ownerAddress)
  let value = localStorage.getItem(localStorageitemKey)

  if (value !== null) {
    items = JSON.parse(value?.toString())
    item = items?.find((i) => {
      return i.walletType == walletType
    })
  }

  return item
}

export const getIExecReadOnly = (): IExecDataProtector | undefined => {
  // 0x1468013e9920246BA10A7A512779801815E742ed is a dummy wallet
  // used to intialize iExec and use it for read only
  const readOnlyPk =
    '0x4037b2cda7bbfca64569283ad2cab41b3fa406eb13ba1e95d326cfcc46ea4fe9' // 0x1468013e9920246BA10A7A512779801815E742ed is a dummy wallet used to intialize iExec and use it for read only
  const web3Provider = getWeb3Provider(readOnlyPk)
  let options: DataProtectorConfigOptions =
    ENVIRONMENT == 'PROD'
      ? {
          subgraphUrl:
            'https://thegraph-product.iex.ec/subgraphs/name/bellecour/dataprotector',
          ipfsNode: 'http://127.0.0.1:5001',
          ipfsGateway: 'http://127.0.0.1:8080'
        }
      : {
          iexecOptions: {
            smsURL: 'https://sms.scone-prod.stagingv8.iex.ec',
            iexecGatewayURL: 'https://api.market.stagingv8.iex.ec'
          },
          ipfsNode: 'http://127.0.0.1:5001',
          ipfsGateway: 'http://127.0.0.1:8080',
          subgraphUrl:
            'https://thegraph-product.iex.ec/subgraphs/name/bellecour/dataprotector'
        }

  return new IExecDataProtector(web3Provider, options)
}

const getIExecFromPrivateKey = (privateKey: string) => {
  const web3Provider = getWeb3Provider(privateKey)
  let options: DataProtectorConfigOptions =
    ENVIRONMENT == 'PROD'
      ? {
          subgraphUrl:
            'https://thegraph-product.iex.ec/subgraphs/name/bellecour/dataprotector',
          ipfsNode: 'http://127.0.0.1:5001',
          ipfsGateway: 'http://127.0.0.1:8080'
        }
      : {
          iexecOptions: {
            smsURL: 'https://sms.scone-prod.stagingv8.iex.ec',
            iexecGatewayURL: 'https://api.market.stagingv8.iex.ec'
          },
          ipfsNode: 'http://127.0.0.1:5001',
          ipfsGateway: 'http://127.0.0.1:8080',
          subgraphUrl:
            'https://thegraph-product.iex.ec/subgraphs/name/bellecour/dataprotector'
        }

  return new IExecDataProtector(web3Provider, options)
}

export const getIExec = (
  walletType: WalletType,
  activeProfile: Profile | null,
  signature: string
): IExecDataProtector | undefined => {
  let storeItem: EncryptedWallet | undefined = getStoreItem(
    walletType,
    activeProfile?.ownedBy.address
  )

  if (!storeItem) {
    return
  }

  //TODO: ensure that the address matches the profile
  if (!isOwner(storeItem, activeProfile)) {
    throw 'An error has occured. Please log-in again'
    // TODO: remove the localstorageitem
  }

  let privateInfo: IExecWalletPrivateInfo = decryptWithSignature(
    storeItem,
    signature
  )

  return getIExecFromPrivateKey(privateInfo.privateKey)
}

export const getWalletAddress = (
  walletType: WalletType,
  activeProfile: Profile | null
): string | undefined => {
  let item: EncryptedWallet | undefined = getStoreItem(
    walletType,
    activeProfile?.ownedBy.address
  )

  //TODO: ensure that the address matches the profile
  if (!isOwner(item, activeProfile)) {
    throw 'An error has occured. Please log-in again'
    // TODO: remove the localstorageitem
  }
  return item?.address
}

export const getCollectionTokenId = (
  activeProfile: Profile | null,
  signature: string
): number => {
  let storeItem: EncryptedWallet | undefined = getStoreItem(
    WalletType.CONTENT_PUBLISHER,
    activeProfile?.ownedBy.address
  )

  if (!storeItem) {
    return -1
  }

  //TODO: ensure that the address matches the profile
  if (!isOwner(storeItem, activeProfile)) {
    throw 'An error has occured. Please log-in again'
    // TODO: remove the localstorageitem
  }

  let privateInfo: IExecWalletPrivateInfo = decryptWithSignature(
    storeItem,
    signature
  )

  return privateInfo?.collectionTokenId || -1
}

const createProtectedCollection = async (privateKey: string) => {
  let iexec = getIExecFromPrivateKey(privateKey)
  let response: CreateCollectionResponse | undefined =
    await iexec?.sharing.createCollection()
  return response?.collectionTokenId
}

export const createWallet = async (
  walletType: WalletType,
  activeProfile: Profile | null,
  signature: string
): Promise<IExecWalletCreate> => {
  if (!activeProfile) {
    throw 'Active profile is not set'
  }

  let localStorageitemKey = getItemKey(activeProfile.ownedBy.address)

  const wallet = ethers.Wallet.createRandom()

  let cacheItem: IExecWalletPrivateInfo = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    owner: activeProfile.ownedBy.address,
    walletType: walletType
  }

  if (walletType == WalletType.CONTENT_PUBLISHER) {
    let collectionTokenId: number | undefined = await createProtectedCollection(
      wallet.privateKey
    )
    cacheItem.collectionTokenId = collectionTokenId
  }

  await createStorageToken(wallet.address, wallet.privateKey)
  let beneficiaryKey = await createBeneficiaryKeys(wallet.privateKey)
  cacheItem.beneficiaryKey = beneficiaryKey

  let json = JSON.stringify(cacheItem)
  let encryptedWallet: EncryptedWallet = encryptWithSignature(json, signature)
  encryptedWallet.walletType = walletType
  encryptedWallet.address = wallet.address

  let existingItem = localStorage.getItem(localStorageitemKey)
  let encryptedWallets: [EncryptedWallet?] = []
  if (existingItem) {
    encryptedWallets = JSON.parse(existingItem)
  }
  encryptedWallets.push(encryptedWallet)

  localStorage.setItem(localStorageitemKey, JSON.stringify(encryptedWallets))

  let passphrase: string = wallet.mnemonic ? wallet.mnemonic.phrase : ''

  if (!passphrase || passphrase.length == 0) {
    throw 'Unable to create iExec wallet'
  }

  return { address: wallet.address, passphrase: passphrase }
}

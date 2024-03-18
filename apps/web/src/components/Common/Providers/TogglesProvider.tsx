import {
  IS_MAINNET,
  TESTNET_ALLOWED_TOKENS,
  WORKER_ALLOWED_TOKENS_URL,
  WORKER_TOGGLES_URL,
  WORKER_VERIFIED_URL
} from '@dragverse/constants'
import useProfileStore from '@lib/store/idb/profile'
import useProfileRestrictionsStore from '@lib/store/idb/restrictions'
import useAllowedTokensStore from '@lib/store/idb/tokens'
import useVerifiedStore from '@lib/store/idb/verified'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { myVerifiedProfiles } from './myVerifiedProfiles'

const TogglesProvider = () => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const setVerifiedProfiles = useVerifiedStore(
    (state) => state.setVerifiedProfiles
  )
  const setProfileRestrictions = useProfileRestrictionsStore(
    (state) => state.setProfileRestrictions
  )
  const setAllowedTokens = useAllowedTokensStore(
    (state) => state.setAllowedTokens
  )

  const fetchVerifiedProfiles = async () => {
    try {
      const { data } = await axios.get(WORKER_VERIFIED_URL)
      const backendVerifiedProfiles = data?.ids ?? [];
      const combinedVerifiedProfiles = [...new Set([...backendVerifiedProfiles, ...myVerifiedProfiles])];
      setVerifiedProfiles(combinedVerifiedProfiles);
    } catch (error) {
      console.error('Error fetching verified profiles:', error);
      // Handle error appropriately
    }
  }

  useQuery({
    queryKey: ['fetchVerifiedProfiles'],
    queryFn: fetchVerifiedProfiles
  })

  const fetchProfileToggles = async () => {
    const { data } = await axios.get(
      `${WORKER_TOGGLES_URL}/${activeProfile?.id}`
    )
    setProfileRestrictions(
      data?.restrictions ?? {
        suspended: false,
        restricted: false,
        flagged: false
      }
    )
  }

  useQuery({
    queryKey: ['fetchProfileToggles'],
    queryFn: fetchProfileToggles,
    enabled: Boolean(activeProfile)
  })

  const fetchAllowedTokens = async () => {
    const { data } = await axios.get(WORKER_ALLOWED_TOKENS_URL)
    setAllowedTokens(IS_MAINNET ? data.tokens ?? [] : TESTNET_ALLOWED_TOKENS)
  }

  useQuery({
    queryKey: ['fetchAllowedTokens'],
    queryFn: fetchAllowedTokens,
    enabled: Boolean(activeProfile)
  })

  return null
}

export default TogglesProvider


import useProfileStore from '@lib/store/idb/profile'
import useProfileRestrictionsStore from '@lib/store/idb/restrictions'
import useVerifiedStore from '@lib/store/idb/verified'
import { useQuery } from '@tanstack/react-query'
import { WORKER_TOGGLES_URL, WORKER_VERIFIED_URL } from '@tape.xyz/constants'
import axios from 'axios'

const TogglesProvider = () => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const setVerifiedProfiles = useVerifiedStore(
    (state) => state.setVerifiedProfiles
  )
  const setProfileRestrictions = useProfileRestrictionsStore(
    (state) => state.setProfileRestrictions
  )

  const fetchVerifiedProfiles = async () => {
    const { data } = await axios.get(WORKER_VERIFIED_URL)
    setVerifiedProfiles(data?.ids ?? [])
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

  return null
}

export default TogglesProvider

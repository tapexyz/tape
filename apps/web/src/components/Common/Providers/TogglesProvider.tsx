import useVerifiedStore from '@lib/store/idb/verified'
import { useQuery } from '@tanstack/react-query'
import { WORKER_VERIFIED_URL } from '@tape.xyz/constants'
import axios from 'axios'

const TogglesProvider = () => {
  const setVerifiedProfiles = useVerifiedStore(
    (state) => state.setVerifiedProfiles
  )

  const fetchVerifiedProfiles = async () => {
    const { data } = await axios.get(WORKER_VERIFIED_URL)
    setVerifiedProfiles(data?.ids ?? [])
  }

  useQuery({
    queryKey: ['fetchVerifiedProfiles'],
    queryFn: fetchVerifiedProfiles
  })

  return null
}

export default TogglesProvider

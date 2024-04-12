import { ADMIN_IDS } from './constants'
import isValidLensToken from './isValidLensToken'
import { parseJwt } from './parseJwt'

const validateIsStaff = async (accessToken: string) => {
  if (!(await isValidLensToken(accessToken))) {
    return false
  }

  try {
    if (!accessToken) {
      return false
    }

    const payload = parseJwt(accessToken)

    if (ADMIN_IDS.includes(payload.id)) {
      return true
    }

    return false
  } catch {
    return false
  }
}

export default validateIsStaff

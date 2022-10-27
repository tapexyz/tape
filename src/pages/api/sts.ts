import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts'
import logger from '@lib/logger'
import {
  API_ORIGINS,
  EVER_API_KEY,
  EVER_API_SECRET,
  EVER_TEMP_BUCKET_NAME,
  IS_MAINNET
} from '@utils/constants'
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'

type Data = {
  accessKeyId?: string
  secretAccessKey?: string
  sessionToken?: string
  bucketName?: string
  dir?: string
  success: boolean
}

const stsClient = new STSClient({
  endpoint: 'https://endpoint.4everland.co',
  region: 'us-west-2',
  credentials: {
    accessKeyId: EVER_API_KEY,
    secretAccessKey: EVER_API_SECRET
  }
})

const sts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const origin = req.headers.origin
  if (IS_MAINNET) {
    if (!origin || !API_ORIGINS.includes(origin))
      return res.status(403).json({ success: false })
  }
  if (req.method !== 'GET') return res.status(400).json({ success: false })
  try {
    // Using the date as the folder name makes it easier to clean up invalid expired files and release storage.
    // Random folder name to avoid users overwriting existing files.
    const dir = new Date().toISOString().split('T')[0] + '/' + uuidv4()
    const params = {
      DurationSeconds: 3600,
      Policy: `{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:PutObject",
                        "s3:AbortMultipartUpload"
                    ],
                    "Resource": [
                        "arn:aws:s3:::${EVER_TEMP_BUCKET_NAME}/${dir}/*"
                    ]
                }
            ]
        }`
    }
    const data = await stsClient.send(
      new AssumeRoleCommand({ ...params, RoleArn: '', RoleSessionName: '' })
    )
    return res.json({
      success: true,
      accessKeyId: data.Credentials?.AccessKeyId,
      secretAccessKey: data.Credentials?.SecretAccessKey,
      sessionToken: data.Credentials?.SessionToken,
      bucketName: EVER_TEMP_BUCKET_NAME,
      dir: dir + '/'
    })
  } catch (error) {
    logger.error('[API Error Get STS]', error)
    return res.status(200).json({ success: false })
  }
}

export default sts

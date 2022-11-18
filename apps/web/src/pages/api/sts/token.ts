import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts'
import logger from '@lib/logger'
import {
  API_ORIGINS,
  EVER_ACCESS_KEY,
  EVER_ACCESS_SECRET,
  EVER_ENDPOINT,
  EVER_REGION,
  IS_MAINNET,
  NEXT_PUBLIC_EVER_BUCKET_NAME
} from '@utils/constants'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  accessKeyId?: string
  secretAccessKey?: string
  sessionToken?: string
  bucketName?: string
  dir?: string
  success: boolean
}

const token = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const origin = req.headers.origin
  if (IS_MAINNET && (!origin || !API_ORIGINS.includes(origin))) {
    return res.status(403).json({ success: false })
  }
  if (req.method !== 'POST') return res.status(400).json({ success: false })
  try {
    const stsClient = new STSClient({
      endpoint: EVER_ENDPOINT,
      region: EVER_REGION,
      credentials: {
        accessKeyId: EVER_ACCESS_KEY,
        secretAccessKey: EVER_ACCESS_SECRET
      }
    })
    const params = {
      DurationSeconds: 3600,
      Policy: `{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:PutObject",
                        "s3:GetObject",
                        "s3:AbortMultipartUpload"
                    ],
                    "Resource": [
                        "arn:aws:s3:::${NEXT_PUBLIC_EVER_BUCKET_NAME}/*"
                    ]
                }
            ]
        }`
    }

    const data = await stsClient.send(
      new AssumeRoleCommand({
        ...params,
        RoleArn: undefined,
        RoleSessionName: undefined
      })
    )
    return res.json({
      success: true,
      accessKeyId: data.Credentials?.AccessKeyId,
      secretAccessKey: data.Credentials?.SecretAccessKey,
      sessionToken: data.Credentials?.SessionToken
    })
  } catch (error) {
    logger.error('[API Error Get STS]', error)
    return res.status(200).json({ success: false })
  }
}

export default token

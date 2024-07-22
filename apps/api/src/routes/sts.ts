import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts'
import { ERROR_MESSAGE } from '@tape.xyz/constants'
import { Hono } from 'hono'

const app = new Hono()

const bucketName = 'tape'
const everEndpoint = 'https://endpoint.4everland.co'
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
          "arn:aws:s3:::${bucketName}/*"
        ]
      }
    ]
  }`
}

app.get('/', async (c) => {
  console.log('[API] Incoming request for STS')
  try {
    const accessKeyId = process.env.EVER_ACCESS_KEY!
    const secretAccessKey = process.env.EVER_ACCESS_SECRET!

    const stsClient = new STSClient({
      endpoint: everEndpoint,
      region: 'us-west-2',
      credentials: { accessKeyId, secretAccessKey }
    })

    const data = await stsClient.send(
      new AssumeRoleCommand({
        ...params,
        RoleArn: undefined,
        RoleSessionName: undefined
      })
    )

    return c.json({
      success: true,
      accessKeyId: data.Credentials?.AccessKeyId,
      secretAccessKey: data.Credentials?.SecretAccessKey,
      sessionToken: data.Credentials?.SessionToken
    })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app

import { AssumeRoleCommand, STSClient } from "@aws-sdk/client-sts";
import {
  ERROR_MESSAGE,
  EVER_BUCKET_NAME,
  EVER_ENDPOINT,
  EVER_REGION,
} from "@tape.xyz/constants";
import { Hono } from "hono";

const app = new Hono();

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
          "arn:aws:s3:::${EVER_BUCKET_NAME}/*"
        ]
      }
    ]
  }`,
};

const { EVER_ACCESS_KEY, EVER_ACCESS_SECRET } = process.env;

const stsClient = new STSClient({
  endpoint: EVER_ENDPOINT,
  region: EVER_REGION,
  credentials: {
    accessKeyId: EVER_ACCESS_KEY,
    secretAccessKey: EVER_ACCESS_SECRET,
  },
});

app.get("/", async (c) => {
  try {
    const data = await stsClient.send(
      new AssumeRoleCommand({
        ...params,
        RoleArn: undefined,
        RoleSessionName: undefined,
      }),
    );

    return c.json({
      success: true,
      accessKeyId: data.Credentials?.AccessKeyId,
      secretAccessKey: data.Credentials?.SecretAccessKey,
      sessionToken: data.Credentials?.SessionToken,
    });
  } catch (error) {
    console.error("[STS] Error:", error);
    return c.json({ success: false, message: ERROR_MESSAGE });
  }
});

export default app;

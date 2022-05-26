import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const token = process.env.LIVEPEER_API_KEY as string;
    const streamName = "test";
    const streamProfiles = [
      {
        name: "720p",
        bitrate: 2000000,
        fps: 30,
        width: 1280,
        height: 720,
      },
      {
        name: "480p",
        bitrate: 1000000,
        fps: 30,
        width: 854,
        height: 480,
      },
      {
        name: "360p",
        bitrate: 500000,
        fps: 30,
        width: 640,
        height: 360,
      },
    ];

    try {
      const createStreamResponse = await axios.post(
        "https://livepeer.com/api/stream",
        {
          name: streamName,
          profiles: streamProfiles,
          record: true,
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (createStreamResponse && createStreamResponse.data) {
        res.statusCode = 200;
        res.json({ ...createStreamResponse.data });
      } else {
        res.statusCode = 500;
        res.json({ error: "Something went wrong" });
      }
    } catch (error: any) {
      res.statusCode = 500;
      if (error.response.status === 403) {
        res.statusCode = 403;
      }
      res.json({ error });
    }
  }
}

import { zValidator } from "@hono/zod-validator";
import {
  CACHE_CONTROL,
  ERROR_MESSAGE,
  TAPE_USER_AGENT
} from "@tape.xyz/constants";
import { Hono } from "hono";
import { parseHTML } from "linkedom";
import { object, string } from "zod";

import extractOgTags from "@/helpers/oembed/extractOgTags";
import { COMMON_REGEX } from "@/helpers/oembed/regex";

const app = new Hono();

const validationSchema = object({
  url: string().url(),
  format: string().optional()
});

app.get("/", zValidator("query", validationSchema), async (c) => {
  try {
    const reqUrl = c.req.url.replace(/&amp;/g, "&");
    const reqUrlParams = new URL(reqUrl).searchParams;

    let url = reqUrlParams.get("url") as string;
    const format = reqUrlParams.get("format") as string;

    if (!url) {
      return c.json(
        { success: false, message: "Missing required parameter: url" },
        400
      );
    }

    if (COMMON_REGEX.TAPE_WATCH.test(url)) {
      // Fetch metatags directly from tape.xyz
      const path = new URL(url).pathname;
      url = `https://og.tape.xyz${path}`;
    }

    // Fetch metatags from URL
    const response = await fetch(url, {
      headers: { "User-Agent": TAPE_USER_AGENT }
    });

    if (!response.ok) {
      return c.json(
        { success: false, message: `Failed to fetch URL: ${response.status}` },
        400
      );
    }

    const html = await response.text();
    const { document } = parseHTML(html);

    const ogData = await extractOgTags(document);

    if (format === "json") {
      c.header("Cache-Control", CACHE_CONTROL.FOR_ONE_WEEK);
      return c.json(ogData);
    }

    if (format === "xml") {
      const escapeXml = (str: string) =>
        String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");

      c.res.headers.set("Content-Type", "application/xml");
      c.header("Cache-Control", CACHE_CONTROL.FOR_ONE_WEEK);
      return c.body(`<?xml version="1.0" encoding="utf-8"?>
        <oembed>
          <title>${escapeXml(ogData.title)}</title>
          <author_name>${escapeXml(ogData.author_name)}</author_name>
          <author_url>${escapeXml(ogData.author_url)}</author_url>
          <type>${escapeXml(ogData.type)}</type>
          <height>${ogData.height}</height>
          <width>${ogData.width}</width>
          <version>${escapeXml(ogData.version)}</version>
          <provider_name>${escapeXml(ogData.provider_name)}</provider_name>
          <provider_url>${escapeXml(ogData.provider_url)}</provider_url>
          <thumbnail_height>${ogData.thumbnail_height}</thumbnail_height>
          <thumbnail_width>${ogData.thumbnail_width}</thumbnail_width>
          <thumbnail_url>${escapeXml(ogData.thumbnail_url)}</thumbnail_url>
          <html>${escapeXml(ogData.html as string)}</html>
        </oembed>`);
    }

    c.header("Cache-Control", CACHE_CONTROL.FOR_ONE_WEEK);
    return c.json({ success: true, og: ogData });
  } catch (error) {
    console.error("[OEMBED] Error:", error);
    return c.json({ success: false, message: ERROR_MESSAGE }, 500);
  }
});

export default app;

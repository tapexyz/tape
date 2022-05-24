import Head from "next/head";
import { useRouter } from "next/router";
import React, { FC } from "react";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  date?: string;
};

const MetaTags: FC<Props> = (props) => {
  const { description, title, image } = props;
  const router = useRouter();

  const meta = {
    title: title ?? "Lenstube",
    description:
      description ??
      "Lenstube is a decentralized video sharing social media platform built with Lens protocol.",
    image: image ?? "/og.png",
    type: "website",
  };

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="robots" content="follow, index" />
      <meta content={meta.description} name="description" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />
      <link rel="canonical" href={`https://sasi.codes${router.asPath}`} />

      <meta property="og:url" content={`https://sasi.codes${router.asPath}`} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={meta.image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@sasicodes" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
    </Head>
  );
};

export default MetaTags;

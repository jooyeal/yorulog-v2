import Head from "next/head";
import React from "react";

type Props = {
  title?: string;
  description: string;
  url?: string;
  image?: string;
};

export default function HeadMeta({ title, description, url, image }: Props) {
  return (
    <Head>
      <title>{title || "YORULOG"}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={url || "https://yorulog-v2.vercel.app"}
      />
      <meta
        property="og:image"
        content={
          image ||
          "https://res.cloudinary.com/doxgf1mhn/image/upload/v1681623225/ec_template/vfnstqlulwhhb9yxxsew.jpg"
        }
      />
    </Head>
  );
}

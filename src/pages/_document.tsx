import { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <meta
        name="google-site-verification"
        content="m1SemBs2ZdWy3yinTbP89KzrWF00CoEYFClegylQqAE"
      />
      <body>
        <ColorModeScript initialColorMode="dark" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

export default function Document() {
  return (
    <Html lang="en">
      <meta
        name="google-site-verification"
        content="m1SemBs2ZdWy3yinTbP89KzrWF00CoEYFClegylQqAE"
      />
      <Head />
      <body>
        <ColorModeScript initialColorMode="dark" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

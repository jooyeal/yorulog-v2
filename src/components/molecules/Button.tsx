import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";
import React from "react";

export default function Button(props: ButtonProps) {
  return <ChakraButton colorScheme="teal" {...props} />;
}

import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Padder({ children }: Props) {
  return (
    <Box className="pt-16 pb-16 pl-36 pr-36 mobile:pt-4 mobile:pb-4 mobile:pl-4 mobile:pr-4">
      {children}
    </Box>
  );
}

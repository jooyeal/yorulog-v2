import { Box, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import Navigation from "./Navigation";

export default function SideBar() {
  return (
    <Box className="fixed top-0 left-0 mobile:hidden">
      <Stack className="h-screen w-80 items-center border-r p-4">
        <Heading>YORULOG</Heading>
        <Navigation />
      </Stack>
    </Box>
  );
}

import { Box } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box className="relative w-screen laptop:flex">
      <Header />
      <SideBar />
      <Box className="min-h-screen pt-6 pb-6 mobile:min-h-[calc(100vh_-_4rem)] laptop:pl-80 w-full">
        {children}
      </Box>
    </Box>
  );
}

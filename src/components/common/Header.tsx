import { Box, IconButton, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Navigation from "./Navigation";

export default function Header() {
  const [isShowNav, setIsShowNav] = useState<boolean>(false);
  const { colorMode } = useColorMode();
  return (
    <Box className="sticky top-0 z-50 laptop:hidden">
      <Box
        className={`flex h-16 w-full items-center pl-4 pr-4 ${
          colorMode === "dark" ? "bg-slate-800" : "bg-slate-50"
        }`}
      >
        <IconButton
          aria-label="header-menu"
          icon={isShowNav ? <AiOutlineClose /> : <AiOutlineMenu />}
          onClick={() => setIsShowNav((prev) => !prev)}
        />
      </Box>
      {isShowNav && <Navigation />}
    </Box>
  );
}

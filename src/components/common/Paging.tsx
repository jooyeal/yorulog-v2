import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";

type Props = {
  prevTo: (() => void) | null;
  nextTo: (() => void) | null;
};

export default function Paging({ prevTo, nextTo }: Props) {
  return (
    <HStack justify="space-between">
      {prevTo ? (
        <HStack>
          <IconButton icon={<BiLeftArrow />} aria-label="" onClick={prevTo} />
          <Text>Prev</Text>
        </HStack>
      ) : (
        <Box />
      )}
      {nextTo ? (
        <HStack>
          <Text>Next</Text>
          <IconButton icon={<BiRightArrow />} aria-label="" onClick={nextTo} />
        </HStack>
      ) : (
        <Box />
      )}
    </HStack>
  );
}

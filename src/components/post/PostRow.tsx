import React from "react";
import { Card, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { Post } from "@prisma/client";
import Link from "next/link";

export default function PostRow({ id, title, subTitle, thumbnail }: Post) {
  return (
    <Link href={`/post/${id}`}>
      <Card p="2" mb="4">
        <Flex>
          <Image
            src={thumbnail || "/no-image.png"}
            width={160}
            height={160}
            objectFit="cover"
            borderRadius="md"
          />
          <Stack p="2" overflow="hidden">
            <Text noOfLines={1} fontWeight="bold" fontSize="xl">
              {title}
            </Text>
            <Text noOfLines={3}>{subTitle}</Text>
          </Stack>
        </Flex>
      </Card>
    </Link>
  );
}

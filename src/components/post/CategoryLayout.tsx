import { Box, Heading, Stack } from "@chakra-ui/react";
import { Post } from "@prisma/client";
import React from "react";
import Layout from "../common/Layout";
import Padder from "../common/Padder";
import PostRow from "./PostRow";

type Props = {
  title: string;
  posts?: Post[];
};

export default function CategoryLayout({ title, posts }: Props) {
  return (
    <Layout>
      <Padder>
        <Stack>
          <Heading mb="10">{title}</Heading>
          <Box>
            {!posts || posts?.length === 0 ? (
              <Heading fontSize="xl">No Result...</Heading>
            ) : (
              posts?.map((post) => <PostRow key={post.id} {...post} />)
            )}
          </Box>
        </Stack>
      </Padder>
    </Layout>
  );
}

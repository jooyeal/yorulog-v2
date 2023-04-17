import { Box, Heading, Skeleton, Stack } from "@chakra-ui/react";
import { Post } from "@prisma/client";
import React from "react";
import Layout from "../common/Layout";
import Padder from "../common/Padder";
import Paging from "../common/Paging";
import PostRow from "./PostRow";

type Props = {
  title: string;
  posts?: Post[];
  isLoading: boolean;
  prevTo: (() => void) | null;
  nextTo: (() => void) | null;
};

export default function CategoryLayout({
  title,
  posts,
  isLoading,
  prevTo,
  nextTo,
}: Props) {
  return (
    <Layout>
      <Padder>
        <Stack>
          <Heading mb="10">{title}</Heading>
          <Box>
            {isLoading ? (
              <Skeleton height="2xl" />
            ) : !posts || posts?.length === 0 ? (
              <Heading fontSize="xl">No Result...</Heading>
            ) : (
              posts?.map((post) => <PostRow key={post.id} {...post} />)
            )}
          </Box>
        </Stack>
        <Stack>
          <Paging
            prevTo={prevTo ? prevTo : null}
            nextTo={nextTo ? nextTo : null}
          />
        </Stack>
      </Padder>
    </Layout>
  );
}

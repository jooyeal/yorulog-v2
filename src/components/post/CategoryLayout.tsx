import { Box, Heading, Stack } from "@chakra-ui/react";
import { Post } from "@prisma/client";
import React from "react";
import Layout from "../common/Layout";
import Padder from "../common/Padder";
import Paging from "../common/Paging";
import PostRow from "./PostRow";

type Props = {
  title: string;
  posts?: Post[];
  prevTo: (() => void) | null;
  nextTo: (() => void) | null;
};

export default function CategoryLayout({
  title,
  posts,
  prevTo,
  nextTo,
}: Props) {
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

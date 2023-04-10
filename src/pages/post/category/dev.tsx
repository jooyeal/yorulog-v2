import Layout from "@/components/common/Layout";
import Padder from "@/components/common/Padder";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetStaticProps } from "next";
import superjson from "superjson";
import React from "react";
import { trpc } from "@/utils/trpc";
import PostRow from "@/components/post/PostRow";
import { Box, Heading, Stack } from "@chakra-ui/react";

export default function CategoryDev() {
  const { data } = trpc.post.getPostsByCategory.useQuery({ category: "DEV" });
  return (
    <Layout>
      <Padder>
        <Stack>
          <Heading mb="10">My development stories</Heading>
          <Box>
            {data?.map((post) => (
              <PostRow key={post.id} {...post} />
            ))}
          </Box>
        </Stack>
      </Padder>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });
  await ssg.post.getPostsByCategory.prefetch({ category: "DEV" });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

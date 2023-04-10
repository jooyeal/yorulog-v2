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

export default function CategoryDev() {
  const { data } = trpc.post.getDev.useQuery();
  return (
    <Layout>
      <Padder>
        {data?.map((post) => (
          <PostRow key={post.id} {...post} />
        ))}
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
  await ssg.post.getDev.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

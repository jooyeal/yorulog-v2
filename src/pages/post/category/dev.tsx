import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetStaticProps } from "next";
import superjson from "superjson";
import React from "react";
import { trpc } from "@/utils/trpc";
import CategoryLayout from "@/components/post/CategoryLayout";

const CATEGORY_NAME = "DEV";

export default function CategoryDev() {
  const { data } = trpc.post.getPostsByCategory.useQuery({
    category: CATEGORY_NAME,
  });
  return <CategoryLayout title="My Development Stories" posts={data} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });
  await ssg.post.getPostsByCategory.prefetch({ category: CATEGORY_NAME });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

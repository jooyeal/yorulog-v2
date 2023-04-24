import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetStaticProps } from "next";
import superjson from "superjson";
import React from "react";
import { trpc } from "@/utils/trpc";
import CategoryLayout from "@/components/post/CategoryLayout";
import { useRouter } from "next/router";
import HeadMeta from "@/components/common/HeadMeta";

const CATEGORY_NAME = "DEV";

export default function CategoryDev() {
  const router = useRouter();
  const { data, isLoading } = trpc.post.getPostsByCategory.useQuery({
    category: CATEGORY_NAME,
    currentPage: router.query.page ? Number(router.query.page) : 1,
    takeNum: 5,
  });
  return (
    <>
      <HeadMeta description="My dev stories. This section will be listed almost with nextjs or react. and maybe mobile dev." />
      <CategoryLayout
        title="My Development Stories"
        posts={data?.posts}
        isLoading={isLoading}
        prevTo={
          data?.prevPage
            ? () =>
                router.push(
                  `/post/category/dev?page=${Number(router.query.page) - 1}`
                )
            : null
        }
        nextTo={
          data?.nextPage
            ? () =>
                router.push(
                  `/post/category/dev?page=${
                    (Number(router.query.page) || 1) + 1
                  }`
                )
            : null
        }
      />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });
  await ssg.post.getPostsByCategory.prefetch({
    category: CATEGORY_NAME,
    currentPage: 1,
    takeNum: 5,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

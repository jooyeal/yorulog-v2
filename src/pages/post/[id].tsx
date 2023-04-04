import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/context";
import superjson from "superjson";
import React from "react";
import { trpc } from "@/utils/trpc";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function PostDetail({ id }: Props) {
  const { data } = trpc.post.getDetail.useQuery({ id });
  return <div>PostDetail</div>;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });
  const id = context.params?.id as string;
  await ssg.post.getDetail.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

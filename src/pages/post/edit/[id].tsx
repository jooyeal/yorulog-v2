import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { trpc } from "@/utils/trpc";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import superjson from "superjson";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function PostEdit({ id }: Props) {
  const { data } = trpc.post.getDetail.useQuery({ id });
  return <div>PostEdit</div>;
}

// if user doesnt have session (not login) go to main page
export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const session = await getSession(context);
  if (!session)
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
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

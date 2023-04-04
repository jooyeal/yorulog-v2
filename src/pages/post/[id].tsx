import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  GetServerSidePropsContext,
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetServerSidePropsType,
} from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/context";
import superjson from "superjson";
import React from "react";
import { trpc } from "@/utils/trpc";
import Layout from "@/components/common/Layout";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { PrismaClient } from "@prisma/client";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function PostDetail({ id }: Props) {
  const { data } = trpc.post.getDetail.useQuery({ id });
  return (
    <Layout>
      <Box className="pt-16 pb-16 pl-36 pr-36 mobile:pt-4 mobile:pb-4 mobile:pl-4 mobile:pr-4">
        <Stack spacing="10">
          <Stack>
            <Heading>{data?.title}</Heading>
            <Text fontSize="xs" color="gray.300">
              Published in{" "}
              {Intl.DateTimeFormat("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(data?.createdAt)}
            </Text>
          </Stack>
          {data?.thumbnail && (
            <Stack>
              <Image
                src={data.thumbnail}
                width={1280}
                height={720}
                alt={data.title}
              />
            </Stack>
          )}
          <Stack>
            <MarkdownPreview className="p-2" source={data?.content} />
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const prisma = new PrismaClient();
//   const posts = await prisma.post.findMany();
//   const paths = posts.map((post) => ({
//     params: {
//       id: post.id,
//     },
//   }));
//   return { paths, fallback: false };
// };

// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ id: string }>
// ) => {
//   const ssg = createProxySSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//     transformer: superjson,
//   });
//   const id = context.params?.id as string;
//   await ssg.post.getAll.prefetch();

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       id,
//     },
//   };
// };

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });
  const id = context.params?.id as string;
  const posts = await ssg.post.getAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

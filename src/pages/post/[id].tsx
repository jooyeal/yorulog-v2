import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetServerSidePropsType,
} from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/context";
import superjson from "superjson";
import React, { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import Layout from "@/components/common/Layout";
import { Box, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { PrismaClient } from "@prisma/client";
import { wait } from "@/utils/common";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/molecules/Button";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});
type Props = InferGetServerSidePropsType<typeof getStaticProps>;

export default function PostDetail({ id }: Props) {
  const { data, isLoading } = trpc.post.getDetail.useQuery({ id });
  const [dispLoading, setDispLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  useEffect(() => {
    if (!isLoading) {
      (async () => {
        await wait(1000);
        setDispLoading(false);
      })();
    }
  }, [isLoading]);
  return (
    <Layout>
      <Box className="pt-16 pb-16 pl-36 pr-36 mobile:pt-4 mobile:pb-4 mobile:pl-4 mobile:pr-4">
        <Stack spacing="10">
          <Stack>
            <Skeleton isLoaded={!dispLoading}>
              <Heading>{data?.title}</Heading>
            </Skeleton>
            <Skeleton isLoaded={!dispLoading}>
              <Text fontSize="xs" color="gray.300">
                Published in{" "}
                {Intl.DateTimeFormat("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).format(data?.createdAt)}
              </Text>
            </Skeleton>
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
            <Skeleton isLoaded={!dispLoading}>
              <MarkdownPreview className="p-2" source={data?.content} />
            </Skeleton>
          </Stack>
          <Stack align="flex-end">
            {session && (
              <Link href={`/post/edit/${id}`}>
                <Button>Edit post</Button>
              </Link>
            )}
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prisma = new PrismaClient();
  const posts = await prisma.post.findMany();
  const paths = posts.map((post) => ({
    params: {
      id: post.id,
    },
  }));
  return { paths, fallback: false };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
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

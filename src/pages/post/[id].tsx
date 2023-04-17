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
import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import Layout from "@/components/common/Layout";
import { Box, Heading, Image, Skeleton, Stack, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/molecules/Button";
import Padder from "@/components/common/Padder";
import PostRow from "@/components/post/PostRow";
import Paging from "@/components/common/Paging";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});
type Props = InferGetServerSidePropsType<typeof getStaticProps>;

export default function PostDetail({ id }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data } = trpc.post.getDetail.useQuery({ id });
  const { data: relatedPostsInfo, isLoading } =
    trpc.post.getPostsByCategory.useQuery({
      category: data?.category || "DEV",
      currentPage,
      takeNum: 5,
    });
  const { data: session } = useSession();
  return (
    <Layout>
      <Padder>
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
                objectFit="cover"
                alt={data.title}
              />
            </Stack>
          )}
          <Stack>
            <MarkdownPreview className="p-2" source={data?.content} />
          </Stack>
          <Stack align="flex-end">
            {session && (
              <Link href={`/post/edit/${id}`}>
                <Button>Edit post</Button>
              </Link>
            )}
          </Stack>
          <Stack>
            <Heading mb="10">Related Posts</Heading>
            <Box>
              {relatedPostsInfo?.posts.map((post) => (
                <PostRow key={post.id} {...post} />
              ))}
            </Box>
          </Stack>
          <Stack>
            {!isLoading ? (
              <Paging
                prevTo={
                  relatedPostsInfo?.prevPage
                    ? () => setCurrentPage((prev) => prev - 1)
                    : null
                }
                nextTo={
                  relatedPostsInfo?.nextPage
                    ? () => setCurrentPage((prev) => prev + 1)
                    : null
                }
              />
            ) : (
              <Skeleton height="xl" />
            )}
          </Stack>
        </Stack>
      </Padder>
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

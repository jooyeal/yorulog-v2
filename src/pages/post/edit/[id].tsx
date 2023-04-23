import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import Layout from "@/components/common/Layout";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { TPost } from "@/server/schemes/postScheme";
import { trpc } from "@/utils/trpc";
import {
  Box,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import superjson from "superjson";
import Button from "@/components/molecules/Button";
import axios from "axios";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function PostEdit({ id }: Props) {
  const [files, setFiles] = useState<FileList | null>();
  const { data } = trpc.post.getDetail.useQuery({ id });
  const router = useRouter();
  const toast = useToast();
  const { mutate } = trpc.post.update.useMutation({
    onSuccess: () => {
      toast({
        title: "success post edit",
        status: "success",
      });
      router.push("/");
    },
    onError: (e) => {
      toast({
        title: e.message,
        status: "error",
      });
    },
  });

  const { watch, setValue, handleSubmit, register } = useForm<TPost>({
    defaultValues: {
      title: data?.title,
      subTitle: data?.subTitle,
      thumbnail: data?.thumbnail,
      content: data?.content,
      category: data?.category,
    },
  });

  const onSubmit: SubmitHandler<TPost> = async (data) => {
    const { title, subTitle, thumbnail, content, category } = data;
    let url: string | null = thumbnail;
    if (files) {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || ""
      );
      formData.append(
        "cloud_name",
        process.env.NEXT_PUBLIC_CLOUDINARY_NAME || ""
      );
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
        formData
      );
      if (data.url) {
        url = data.url;
      }
    }
    mutate({
      id,
      title,
      subTitle,
      thumbnail: url,
      content,
      category,
    });
  };

  return (
    <Layout>
      <Stack p={6} spacing={10}>
        <Heading>Edit Post </Heading>
        <Box>
          <FormLabel className="border-l pl-2 border-teal-500">Title</FormLabel>
          <Input {...register("title")} placeholder="Title" />
        </Box>
        <Box>
          <FormLabel className="border-l pl-2 border-teal-500">
            Sub Title
          </FormLabel>
          <Input {...register("subTitle")} placeholder="Sub Title" />
        </Box>
        <Box>
          <FormLabel className="border-l pl-2 border-teal-500">
            Category
          </FormLabel>
          <Select {...register("category")} placeholder="Category">
            <option value="DEV">development</option>
            <option value="DAILY">daily</option>
          </Select>
        </Box>
        <Box>
          <FormLabel className="border-l pl-2 border-teal-500">
            Thumbnail
          </FormLabel>
          <input
            onChange={(e) => setFiles(e.target.files)}
            type="file"
            accept="image/*"
          />
        </Box>
        <Box>
          <FormLabel className="border-l pl-2 border-teal-500">
            Post Content
          </FormLabel>
          <MDEditor
            preview="edit"
            value={watch("content")}
            onChange={(e) => setValue("content", e || "")}
            highlightEnable
          />
        </Box>
        <Box>
          <FormLabel className="border-l pl-2 border-teal-500">
            Markdown preview
          </FormLabel>
          <MarkdownPreview className="p-2" source={watch("content")} />
        </Box>
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </Stack>
    </Layout>
  );
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

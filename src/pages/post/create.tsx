import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import Layout from "@/components/common/Layout";
import { Box, FormLabel, Heading, Input, Stack } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TCreatePost } from "@/types/post";
import Button from "@/components/molecules/Button";
import { trpc } from "@/utils/trpc";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

const PostCreate = () => {
  const { watch, setValue, handleSubmit, register } = useForm<TCreatePost>();

  const onSubmit: SubmitHandler<TCreatePost> = (data) => {
    console.log(data);
  };

  return (
    <Layout>
      <Stack p={6} spacing={10}>
        <Heading>Create Post </Heading>
        <Box>
          <FormLabel className="border-l pl-2 border-teal-500">Title</FormLabel>
          <Input {...register("title")} placeholder="Title" />
        </Box>
        <Box>
          <FormLabel className="border-l pl-2 border-teal-500">
            Thumbnail
          </FormLabel>
          <input {...register("thumbnail")} type="file" accept="image/*" />
        </Box>
        <Box>
          <FormLabel className="border-l pl-2 border-teal-500">
            Post Content
          </FormLabel>
          <MDEditor
            preview="edit"
            value={watch("content")}
            onChange={(e) => e && setValue("content", e)}
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
};

export default PostCreate;

// if user doesnt have session (not login) go to main page
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session)
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  return { props: {} };
};

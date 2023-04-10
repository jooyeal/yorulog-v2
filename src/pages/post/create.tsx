import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import Layout from "@/components/common/Layout";
import {
  Box,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/components/molecules/Button";
import { trpc } from "@/utils/trpc";
import { TPost } from "@/server/schemes/postScheme";
import { useRouter } from "next/router";
import axios from "axios";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

const PostCreate = () => {
  const router = useRouter();
  const toast = useToast();
  const { mutate } = trpc.post.create.useMutation({
    onSuccess: () => {
      toast({
        title: "success post upload",
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
  const { watch, setValue, handleSubmit, register } = useForm<TPost>();

  const onSubmit: SubmitHandler<TPost> = async (data) => {
    const { title, subTitle, thumbnail, content, category } = data;
    let url = "/no-image.png";
    if (thumbnail) {
      const formData = new FormData();
      formData.append("file", thumbnail[0]);
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
        <Heading>Create Post </Heading>
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
          <input {...register("thumbnail")} type="file" accept="image/*" />
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

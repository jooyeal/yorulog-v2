import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import Layout from "@/components/common/Layout";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

const PostCreate = () => {
  const [value, setValue] = useState<string | undefined>("**Hello world!!!**");

  return (
    <Layout>
      <MDEditor value={value} onChange={(e) => setValue(e)} highlightEnable />
      <MarkdownPreview source={value} />
    </Layout>
  );
};

export default PostCreate;

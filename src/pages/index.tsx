import PostCard from "@/components/post/PostCard";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetStaticProps, type NextPage } from "next";
import superjson from "superjson";
import Head from "next/head";
import Image from "next/image";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiReacthookform,
  SiReactquery,
  SiRedux,
  SiTrpc,
  SiNextdotjs,
  SiGraphql,
  SiPrisma,
} from "react-icons/si";
import Layout from "../components/common/Layout";
import Button from "../components/molecules/Button";
import { useRouter } from "next/router";
import HeadMeta from "@/components/common/HeadMeta";

const Home: NextPage = () => {
  const { colorMode } = useColorMode();
  const { data } = trpc.post.getLatest.useQuery();
  const router = useRouter();
  return (
    <>
      <HeadMeta
        title="YORULOG"
        description="blog for people who interested in japanese, and software development."
      />
      <Layout>
        <Flex className="flex-wrap justify-around gap-6">
          <Stack flex={0.6}>
            <Heading size="2xl">Juyeol Cha</Heading>
            <Text fontSize="2xl">Software Engineer</Text>
            <Text className="break-all">
              I am a software engineer specialised in frontend development for
              web apps. I write about software development and my daily life on
              my blog. Want to know how I may help your project? please contact
              me.
            </Text>
            <Button onClick={() => router.push("/contact")}>Contact</Button>
          </Stack>
          <Stack>
            <Image src="/profile.jpeg" alt="profile" width={320} height={180} />
          </Stack>
        </Flex>
        <Box className="p-10">
          <Divider mt={10} />
          <Heading className="mt-20 border-l-4 border-teal-400 pl-6">
            What I do
          </Heading>
          <Text className="mt-6 break-all">
            I have a lot of up-to-date skills for creating web or app, mainly
            focused on front-end but also including back-end as one of my areas
            of expertise
          </Text>
          <Flex className="mt-10 flex-wrap gap-6 justify-center">
            <Card className="w-96" variant="outline">
              <CardBody>
                <HStack>
                  <SiJavascript
                    className={`${
                      colorMode === "dark"
                        ? "text-yellow-300"
                        : "text-yellow-400"
                    }`}
                    size={32}
                  />
                  <SiTypescript className=" text-blue-600" size={32} />
                </HStack>
                <Text className="mt-2 mb-2 font-bold">
                  Javascript / Typescript
                </Text>
                <Text>
                  My main languages are JavaScript and TypeScript. Recently, I
                  have fallen in love with TypeScript and have been using it
                  exclusively.
                </Text>
              </CardBody>
            </Card>
            <Card className="w-96" variant="outline">
              <CardBody>
                <HStack>
                  <SiReact className="text-blue-500" size={32} />
                </HStack>
                <Text className="mt-2 mb-2 font-bold">React.js</Text>
                <Text>
                  React is the UI library that I always use when developing web
                  frontends. When React is used in conjunction with TypeScript,
                  it is possible to create a very powerful web application
                </Text>
              </CardBody>
            </Card>
            <Card className="w-96" variant="outline">
              <CardBody>
                <HStack>
                  <SiReacthookform className="text-pink-500" size={32} />
                  <SiReactquery className="text-red-500" size={32} />
                  <SiRedux className="text-purple-700" size={32} />
                </HStack>
                <Text className="mt-2 mb-2 font-bold">
                  React Hook Form / React Query / Redux
                </Text>
                <Text>
                  I use React Hook Form, React Query, and Redux with React to
                  provide a more powerful development experience. By using these
                  libraries, I can have more advantages in managing state and
                  handling forms
                </Text>
              </CardBody>
            </Card>
            <Card className="w-96" variant="outline">
              <CardBody>
                <HStack>
                  <SiNextdotjs size={32} />
                </HStack>
                <Text className="mt-2 mb-2 font-bold">Next.js</Text>
                <Text>
                  Next.js is the web development framework that I use the most.
                  As a full-stack framework for React developers, it enables me
                  to develop both frontend and backend at once.
                </Text>
              </CardBody>
            </Card>
            <Card className="w-96" variant="outline">
              <CardBody>
                <HStack>
                  <SiTrpc className="text-blue-500" size={32} />
                  <SiGraphql className="text-pink-500" size={32} />
                </HStack>
                <Text className="mt-2 mb-2 font-bold">TRPC / GraphQL</Text>
                <Text>
                  While many projects use basic REST API, there are times when
                  using other methods is better. I can use TRPC and GraphQL, and
                  among them, I love TRPC because of its fantastic compatibility
                  with Next.js
                </Text>
              </CardBody>
            </Card>
            <Card className="w-96" variant="outline">
              <CardBody>
                <HStack>
                  <SiPrisma size={32} />
                </HStack>
                <Text className="mt-2 mb-2 font-bold">Prisma</Text>
                <Text>
                  Prisma is an ORM used for working with databases, and it is
                  also one of my favorite libraries
                </Text>
              </CardBody>
            </Card>
          </Flex>
          <Divider className="mt-20" />
          <Heading className="mt-20 border-l-4 border-teal-400 pl-6 ">
            Latest Blog Posts
          </Heading>
          <Flex mt={6} wrap="wrap" gap={6} justify="center">
            {data?.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                thumbnail={post.thumbnail}
                title={post.title}
                subTitle={post.subTitle}
              />
            ))}
          </Flex>
        </Box>
      </Layout>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });
  await ssg.post.getLatest.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

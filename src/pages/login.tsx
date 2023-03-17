import { Button, Center, Heading } from "@chakra-ui/react";
import React from "react";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";

const Login = () => {
  const { data: session } = useSession();
  return (
    <Center className="h-screen flex-col gap-6">
      <Heading>Login page for admin user</Heading>
      {session ? (
        <Button colorScheme="teal" onClick={() => signOut()}>
          Sign out
        </Button>
      ) : (
        <Button colorScheme="teal" onClick={() => signIn()}>
          Sign in
        </Button>
      )}
    </Center>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session)
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  return { props: {} };
};

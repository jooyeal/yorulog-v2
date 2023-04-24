import Layout from "@/components/common/Layout";
import Button from "@/components/molecules/Button";
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { FormEvent, useRef } from "react";
import emailjs from "emailjs-com";
import { useRouter } from "next/router";
import HeadMeta from "@/components/common/HeadMeta";

export default function Contact() {
  const formRef = useRef(null);
  const toast = useToast();
  const router = useRouter();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formRef.current)
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID ?? "",
          process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID ?? "",
          formRef.current,
          process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY
        )
        .then(
          (result) => {
            if (result.status === 200) {
              toast({
                title: "Thank you for contact!",
                status: "success",
              });
              router.push("/");
            }
          },
          (error) => {
            console.log(error);
            toast({
              title: "Sorry something is wrong...",
              status: "error",
            });
          }
        );
  };
  return (
    <Layout>
      <HeadMeta description="contact to yoru!" />
      <Container>
        <Stack align="center">
          <Heading>Contact to me</Heading>
          <Box className="w-full">
            <FormControl ref={formRef} onSubmit={onSubmit} as="form">
              <Stack>
                <Box>
                  <FormLabel>Your email address</FormLabel>
                  <Input name="user_email" required />
                </Box>
                <Box>
                  <FormLabel>Your name</FormLabel>
                  <Input name="user_name" required />
                </Box>
                <Box>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    name="message"
                    className="resize-none"
                    required
                    rows={8}
                  />
                </Box>
                <Button type="submit">SEND</Button>
              </Stack>
            </FormControl>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
}

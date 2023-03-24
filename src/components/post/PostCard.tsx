import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

type Props = {
  thumbnail: string;
  title: string;
  content: string;
};

const PostCard = ({ thumbnail, title, content }: Props) => {
  return (
    <Card width={320}>
      <CardHeader>
        <Image src={thumbnail} width={320} height={180} alt="post-thumbnail" />
      </CardHeader>
      <CardBody>
        <Heading isTruncated>{title}</Heading>
        <Text noOfLines={3}>
          {content}
          {content}
        </Text>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default PostCard;

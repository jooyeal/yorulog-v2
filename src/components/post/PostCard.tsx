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
  thumbnail: string | null;
  title: string;
  subTitle: string;
};

const PostCard = ({ thumbnail, title, subTitle }: Props) => {
  return (
    <Card width={320}>
      <CardHeader>
        <Image
          src={thumbnail || "/no-image.png"}
          width={320}
          height={180}
          alt="post-thumbnail"
        />
      </CardHeader>
      <CardBody>
        <Heading isTruncated>{title}</Heading>
        <Text noOfLines={3}>{subTitle}</Text>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default PostCard;

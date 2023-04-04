import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  id: string;
  thumbnail: string | null;
  title: string;
  subTitle: string;
};

const PostCard = ({ id, thumbnail, title, subTitle }: Props) => {
  return (
    <Link href={`/post/${id}`}>
      <Card width={320} height={500}>
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
    </Link>
  );
};

export default PostCard;

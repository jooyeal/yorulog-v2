import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
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
      <Card width={320} height={380}>
        <CardHeader>
          <Image
            src={thumbnail || "/no-image.png"}
            width={320}
            height={180}
            objectFit="cover"
            alt="post-thumbnail"
          />
        </CardHeader>
        <CardBody>
          <Heading isTruncated>{title}</Heading>
          <Text noOfLines={3} wordBreak="break-all">
            {subTitle}
          </Text>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
    </Link>
  );
};

export default PostCard;

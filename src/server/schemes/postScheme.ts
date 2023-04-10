import { z } from "zod";

export const postScheme = z.object({
  title: z.string(),
  subTitle: z.string(),
  thumbnail: z.string().nullable(),
  content: z.string(),
  category: z.enum(["DAILY", "DEV"]),
});

export const getPostParams = z.object({
  id: z.string(),
});

export type TPost = z.infer<typeof postScheme>;

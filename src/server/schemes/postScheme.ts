import { z } from "zod";

export const postScheme = z.object({
  title: z.string(),
  thumbnail: z.string().nullable(),
  content: z.string(),
});

export type TPost = z.infer<typeof postScheme>;

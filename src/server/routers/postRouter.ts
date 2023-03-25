import { postScheme } from "../schemes/postScheme";
import { router, publicProcedure } from "../trpc";
import prisma from "../../utils/db";
import { TRPCError } from "@trpc/server";

export const postRouter = router({
  create: publicProcedure.input(postScheme).mutation(async ({ input }) => {
    try {
      await prisma.post.create({
        data: {
          title: input.title,
          thumbnail: input.thumbnail,
          content: input.content,
        },
      });
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SERVER ERROR IS OCCURED!",
      });
    }
  }),
});

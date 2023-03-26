import { postScheme } from "../schemes/postScheme";
import { router, authenticatedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const postRouter = router({
  create: authenticatedProcedure
    .input(postScheme)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.post.create({
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

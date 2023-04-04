import { getPostParams, postScheme } from "../schemes/postScheme";
import { router, authenticatedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const postRouter = router({
  create: authenticatedProcedure
    .input(postScheme)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.post.create({
          data: {
            ...input,
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
  getDetail: publicProcedure
    .input(getPostParams)
    .query(async ({ input, ctx }) => {
      try {
        const post = await ctx.prisma.post.findUnique({
          where: { id: input.id },
        });
        return post;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SERVER ERROR IS OCCURED!",
        });
      }
    }),
  getLatest: publicProcedure.query(async ({ input, ctx }) => {
    try {
      const latestPosts = await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
      });
      return latestPosts;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SERVER ERROR IS OCCURED!",
      });
    }
  }),
});

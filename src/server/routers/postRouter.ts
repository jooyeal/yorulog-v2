import { getPostParams, postScheme } from "../schemes/postScheme";
import { router, authenticatedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
  update: authenticatedProcedure
    .input(postScheme.and(z.object({ id: z.string() })))
    .mutation(async ({ input, ctx }) => {
      const { id, ...rest } = input;
      try {
        await ctx.prisma.post.update({
          where: {
            id,
          },
          data: {
            ...rest,
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
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const allPosts = await ctx.prisma.post.findMany();
      return allPosts;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SERVER ERROR IS OCCURED!",
      });
    }
  }),
  getPostsByCategory: publicProcedure
    .input(
      postScheme
        .pick({ category: true })
        .and(z.object({ currentPage: z.number(), takeNum: z.number() }))
    )
    .query(async ({ input, ctx }) => {
      try {
        const { currentPage, takeNum } = input;
        const posts = await ctx.prisma.post.findMany({
          where: {
            category: input.category,
          },
          take: takeNum,
          skip: currentPage > 1 ? (currentPage - 1) * takeNum : 0,
        });
        return {
          posts,
          prevPage: currentPage > 1 ? currentPage - 1 : null,
          nextPage: posts.length < takeNum ? null : currentPage + 1,
        };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SERVER ERROR IS OCCURED!",
        });
      }
    }),
});

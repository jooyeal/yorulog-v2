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
  getDev: publicProcedure.query(async ({ ctx }) => {
    try {
      const devPosts = await ctx.prisma.post.findMany({
        where: {
          category: "DEV",
        },
      });
      return devPosts;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SERVER ERROR IS OCCURED!",
      });
    }
  }),
  getDaily: publicProcedure.query(async ({ ctx }) => {
    try {
      const dailyPosts = await ctx.prisma.post.findMany({
        where: {
          category: "DAILY",
        },
      });
      return dailyPosts;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SERVER ERROR IS OCCURED!",
      });
    }
  }),
});

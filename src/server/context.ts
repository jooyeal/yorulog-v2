import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  const prisma = new PrismaClient();
  const session = await getSession({ req: opts?.req });
  return { prisma, session };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

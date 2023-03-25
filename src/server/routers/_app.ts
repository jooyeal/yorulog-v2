import { router } from "../trpc";
import { postRouter } from "./postRouter";
export const appRouter = router({
  post: postRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

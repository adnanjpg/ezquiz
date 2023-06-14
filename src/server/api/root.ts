import { createTRPCRouter } from "~/server/api/trpc"
import { quizzesRouter } from "./routers/quizzes"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  quizzes: quizzesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

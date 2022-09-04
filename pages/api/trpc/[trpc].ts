import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { createContext, createRouter } from './Context';


const quizzes = createRouter()
    .mutation('create', {
        input: z.object({
            questions: z.array(
                z.object({
                    text: z.string(),
                    answers: z.array(
                        z.object({
                            text: z.string(),
                            iscorrect: z.boolean()
                        })
                    )
                })
            )
        }),
        resolve: ({ input }) => {
            // add the quiz to db,
            // and return the id
            return {
                // id: ...
            }
        }
    })

const appRouter = createRouter()
    .merge('quiz.', quizzes)


// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
});
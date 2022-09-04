import { PrismaClient } from '@prisma/client';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { createContext, createRouter } from './Context';

const prisma = new PrismaClient()

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
        resolve: async ({ input }) => {
            // add the quiz to db,
            // and return the id

            // TODO: after initing auth take this 
            // from incoming request
            const currentUserId = 1

            const cQuiz = await prisma.quiz.create({
                data: { creatorId: currentUserId }
            })

            const cQuizId = cQuiz.id

            input.questions.forEach(async question => {
                const q = await prisma.question.create({
                    data: {
                        quizId: cQuizId,
                        ...question
                    }
                })

                const qid = q.id

                question.answers.forEach(async answer => {
                    await prisma.questionAnswer.create({
                        data: {
                            questionId: qid,
                            ...answer
                        }
                    })
                })
            })



            return {
                id: cQuizId
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
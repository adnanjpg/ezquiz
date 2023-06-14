import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import z from "zod"

export const quizzesRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        questions: z.array(
          z.object({
            text: z.string(),
            answers: z.array(
              z.object({
                text: z.string(),
                iscorrect: z.boolean(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO(adnanjpg): get userId from ctx.session
      const userId = "1"

      const quiz = await ctx.prisma.quiz.create({
        data: {
          creatorId: userId,
        },
      })

      const quizId = quiz.id

      for (const qu of input.questions) {
        const quest = await ctx.prisma.question.create({
          data: {
            quizId: quizId,
            text: qu.text,
          },
        })

        await ctx.prisma.questionAnswer.createMany({
          data: qu.answers.map((a) => ({
            questionId: quest.id,
            text: a.text,
            iscorrect: a.iscorrect,
          })),
        })
      }

      return quiz
    }),
})

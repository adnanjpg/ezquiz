import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import z from "zod"

export const quizzesRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: { id: input.id },
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
      })

      return quiz
    }),
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
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
          title: input.title,
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

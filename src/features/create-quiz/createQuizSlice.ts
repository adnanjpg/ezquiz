import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "~/app/store"
import { Question, QuestionAnswer } from "~/features/quiz/quizSlice"

const maxAnswerCount = 10
const minAnswerCount = 2

const maxQuestionCount = 10

export enum CreateQuizStep {
  writingTitle,
  creatingQuestions,
}

interface CreateQuizState {
  title?: string
  questions?: Array<Question>
  answers?: Array<QuestionAnswer>
  currentStep: CreateQuizStep
  selectedQuestionId?: number
}

const initialState: CreateQuizState = {
  currentStep: CreateQuizStep.writingTitle,
}

// #region selectors

export const selectCurrentStep = (state: RootState) =>
  state.createQuiz.currentStep

export const selectQuizTitle = (state: RootState) => state.createQuiz.title

export const selectAllQuestions = (state: RootState) =>
  state.createQuiz.questions

const selectCurrentQuestionId = (state: RootState) => {
  const selectedQuestionId = state.createQuiz.selectedQuestionId

  if (!selectedQuestionId) throw new Error("NO SELECTED QUESTION")

  return selectedQuestionId
}

const selectQuestionWithId = (props: { state: RootState; id: number }) =>
  selectAllQuestions(props.state)?.find((e) => e.id === props.id)

const selectQuestionAnswers = (props: { state: RootState; id: number }) =>
  selectQuestionWithId(props)?.answers

export const selectCurrentQuestion = (state: RootState) =>
  selectQuestionWithId({
    state: state,
    id: selectCurrentQuestionId(state),
  })

export const selectCurrentQuestionAnswers = (state: RootState) =>
  selectQuestionAnswers({ state, id: selectCurrentQuestionId(state) })

export const selectCanAddAnswer = (state: RootState) => {
  const q = selectCurrentQuestion(state)
  const answers = q?.answers

  return (
    q &&
    // should be either has not inited answers yet
    // or the answers' length should be under max
    (!answers || answers.length <= maxAnswerCount)
  )
}

export const selectCanAddQuestion = (state: RootState) => {
  const quests = state.createQuiz.questions

  return !quests || quests.length <= maxQuestionCount
}

export const selectCanGoNextQuestion = (state: RootState) => {
  const q = selectCurrentQuestion(state)
  const answers = q?.answers

  return q && answers && answers.length >= minAnswerCount
}
export const selectCorrectAnswerIdsForQ = (props: {
  state: RootState
  id: number
}) => {
  const selectedQ = selectQuestionWithId(props)

  if (!selectedQ) throw new Error("NO QUESTION WITH ID")

  return selectedQ.correctAnswersIds
}

const selectIsAnswerCorrect = (props: {
  state: RootState
  qid: number
  ansid: number
}) => {
  const ansIds = selectCorrectAnswerIdsForQ({
    state: props.state,
    id: props.qid,
  })

  return ansIds && ansIds.includes(props.ansid)
}

export const selectIsAnswerCorrectCQ = (props: {
  state: RootState
  ansid: number
}) =>
  selectIsAnswerCorrect({
    ...props,
    qid: selectCurrentQuestionId(props.state),
  })
//#endregion

export const createQuizSlice = createSlice({
  name: "create-quiz",
  initialState,
  reducers: {
    // #region  reducers
    setStep: (state, action: PayloadAction<CreateQuizStep>) => {
      state.currentStep = action.payload
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
    setSelectedQuestionId: (state, action: PayloadAction<number>) => {
      state.selectedQuestionId = action.payload
    },
    createAnswer: (state) => {
      const qid = state.selectedQuestionId

      state.questions = state.questions!.map((e) => {
        if (e.id === qid) {
          const answers = e.answers ?? []

          const lastAnswer = answers ? answers[answers.length - 1] : null
          const lastId = lastAnswer?.id ?? "0"
          const newId = +lastId + 1

          return { ...e, answers: [...(e.answers ?? []), { id: newId }] }
        }

        return e
      })
    },
    updateAnswer: (state, action: PayloadAction<QuestionAnswer>) => {
      const ans = action.payload
      const ansid = ans.id
      const qid = state.selectedQuestionId

      state.questions = state.questions!.map((e) => {
        if (e.id === qid) {
          const answers = e.answers ?? []

          return {
            ...e,
            answers: answers.map((r) => (r.id === ansid ? ans : r)),
          }
        }
        return e
      })
    },
    setAnswerIsCorrect: (
      state,
      action: PayloadAction<{ id: number; iscorrect: boolean }>,
    ) => {
      const selectedQId = state.selectedQuestionId
      const ansId = action.payload.id
      const iscorrect = action.payload.iscorrect

      state.questions = state.questions?.map((question) =>
        question.id === selectedQId
          ? {
              ...question,
              correctAnswersIds: iscorrect
                ? [...(question.correctAnswersIds ?? []), ansId]
                : question.correctAnswersIds?.filter((id) => id !== ansId),
            }
          : question,
      )
    },
    removeAnswer: (state, action: PayloadAction<number>) => {
      const ansid = action.payload
      const qid = state.selectedQuestionId

      state.questions = state.questions!.map((e) => {
        if (e.id === qid) {
          const answers = e.answers ?? []

          return {
            ...e,
            answers: answers.filter((r) => r.id !== ansid),
          }
        }
        return e
      })
    },
    createQuestion: (state) => {
      const questions = state.questions ?? []

      const lastQ = questions ? questions[questions.length - 1] : null
      const lastId = lastQ?.id ?? "0"
      const newId = +lastId + 1

      if (!state.questions) state.questions = []

      state.questions = [...state.questions, { id: newId }]

      state.selectedQuestionId = newId
    },

    removeQuestion: (state, action: PayloadAction<Question>) => {
      state.questions = state.questions?.filter(
        (e) => e.id !== action.payload.id,
      )
    },
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const newQ = action.payload
      state.questions = state.questions?.map((e) =>
        e.id === newQ.id ? newQ : e,
      )
    },
    // #endregion
  },
})

export const {
  setTitle,
  setStep,
  setSelectedQuestionId,
  createQuestion,
  removeQuestion,
  updateQuestion,
  createAnswer,
  updateAnswer,
  setAnswerIsCorrect,
  removeAnswer,
} = createQuizSlice.actions

export default createQuizSlice.reducer

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk, RootState } from "../../app/store"

import questions from "../../assets/questions.json"

export interface QuestionAnswer {
  id: string
  text?: string
}

export interface Question {
  id: string
  text?: string
  answers?: Array<QuestionAnswer>
  correctAnswersIds?: Array<string>
}

// this defines the state of selected
// answers for each questions
export interface SelectedAnswer {
  qid: string
  ansids: Array<string>
}

export enum QuizProgressState {
  NotStarted,
  Ongoing,
  ConfirmingFinish,
  Finished,
}

export interface QuizState {
  progState: QuizProgressState
  selectedQuestionId?: string
  questions: Array<Question>
  selectedAnswers: Array<SelectedAnswer>
}

const initialState: QuizState = {
  progState: QuizProgressState.NotStarted,
  questions: questions,
  selectedAnswers: [],
}

// this will be used to determine wether to show a radio or a checkbox
export const isQuestionMultiSelection = (que: Question) =>
  que.correctAnswersIds && que.correctAnswersIds.length > 1

export const selectSelectedAnswersForQ = (props: {
  state: RootState
  qid: string
}) => {
  return props.state.quiz.selectedAnswers.find((e) => e.qid === props.qid)
}

export const isAnswered = (props: { state: RootState; qid: string }) =>
  !!selectSelectedAnswersForQ({ state: props.state, qid: props.qid })?.ansids

export const isAnswerSelected = (props: {
  state: RootState
  qid: string
  ansid: string
}) =>
  selectSelectedAnswersForQ({
    state: props.state,
    qid: props.qid,
  })?.ansids.includes(props.ansid)

const isFirstQuestion = (que: Question, state: RootState) => {
  let fQ = selectFirstQuestion(state)

  if (fQ == undefined) {
    throw new Error("There is no first question")
  }

  return que.id == fQ.id
}

const isLastQuestion = (que: Question, state: RootState) => {
  let lQ = selectLastQuestion(state)

  if (lQ == undefined) {
    throw new Error("There is no last question")
  }

  return que.id == lQ.id
}

export const selectAnyQuestionIsSelecteed = (state: RootState) =>
  state.quiz.selectedQuestionId != null

export const selectCurrentQuestionId = (state: RootState) =>
  state.quiz.selectedQuestionId

export const selectFirstQuestion = (state: RootState) =>
  state.quiz.questions.at(0)

/**
 *
 * @param state
 * @returns a tuple with the actual score as the first element, and
 * the total score as the second, e.g. 3.2 out of 5 -> [3.2,5]
 *
 */
export const selectFinalScore = (state: RootState): [number, number] => {
  const quiz = state.quiz
  const quests = quiz.questions
  const sAnswers = quiz.selectedAnswers

  let score = 0
  let totalScore = quests.length

  if (sAnswers) {
    quests.forEach((que) => {
      const qid = que.id
      let selectedAnswers = selectSelectedAnswersForQ({
        state: state,
        qid: qid,
      })?.ansids
      let correctAnswers = sAnswers.find((e) => e.qid === qid)?.ansids

      if (!correctAnswers || !selectedAnswers) {
        // if the question does not have correct answers,
        // or the user has not marked any
        return
      }

      let an = correctAnswers

      let correctAnswerCount = an.length

      // what we wanna do is give a bit of score for each correct selection
      // e.g. in multi selection questions, if there are 2 correct answers,
      // the user will get .5 point for each correct selection, etc.

      // so what we're gonna do is this:
      // (count of selected answers that match the correct answers) / answerCount
      let correctSelectedCount = selectedAnswers.filter((e) =>
        an.includes(e)
      ).length

      score += correctSelectedCount / correctAnswerCount
    })
  }

  return [score, totalScore]
}

export const selectQuizProgState = (state: RootState) => state.quiz.progState
export const selectQuizHasStarted = (state: RootState) =>
  state.quiz.progState != QuizProgressState.NotStarted
export const selectQuizIsConfirmingFinish = (state: RootState) =>
  state.quiz.progState == QuizProgressState.ConfirmingFinish
export const selectQuizIsFinished = (state: RootState) =>
  state.quiz.progState == QuizProgressState.Finished
export const selectQuizIsOngoing = (state: RootState) =>
  state.quiz.progState == QuizProgressState.Ongoing

export const selectLastQuestion = (state: RootState) => {
  const q = state.quiz
  const ques = q.questions

  const len = ques.length

  return ques.at(len - 1)
}

export const selectSelectedQuestion = (state: RootState) => {
  const quz = state.quiz
  const slctd = selectCurrentQuestionId(state)

  if (slctd == null) {
    return null
  }

  return quz.questions.find((e) => e.id == slctd)
}

export const selectAllQuestions = (state: RootState) => state.quiz.questions
export const selectAllQuestionIds = (state: RootState) =>
  selectAllQuestions(state).map((e) => e.id)

export const selectIsInFirstQuestion = (state: RootState) =>
  isFirstQuestion(selectSelectedQuestion(state)!, state)
export const selectIsInLastQuestion = (state: RootState) =>
  isLastQuestion(selectSelectedQuestion(state)!, state)

export const setToPrevQuestion = (): AppThunk => (dispatch, getState) => {
  const currentValue = selectCurrentQuestionId(getState()) || "1"

  try {
    const intId: number = +currentValue

    dispatch(setSelectedQuestion(String(intId - 1)))
  } catch (error) {
    throw new Error("Ur id should be int convertible!!!")
  }
}

export const setToNextQuestion = (): AppThunk => (dispatch, getState) => {
  const currentValue = selectCurrentQuestionId(getState()) || "0"

  try {
    const intId: number = +currentValue

    dispatch(setSelectedQuestion(String(intId + 1)))
  } catch (error) {
    throw new Error("Ur id should be int convertible!!!")
  }
}

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setSelectedQuestion: (state, action: PayloadAction<string>) => {
      state.selectedQuestionId = action.payload
    },
    // for checkboxes
    toggleAnswer: (
      state,
      action: PayloadAction<{ qid: string; ansid: string; ischecked: boolean }>
    ) => {
      state.selectedAnswers = state.selectedAnswers.map((e) => {
        if (e.qid != action.payload.qid) return e

        const ecopy = { ...e }

        if (action.payload.ischecked) {
          ecopy.ansids.push(action.payload.ansid)
        } else {
          ecopy.ansids = ecopy.ansids.filter((e) => e != action.payload.ansid)
        }

        return ecopy
      })
    },
    // for radios, it invalidates all other options
    setAnswer: (
      state,
      action: PayloadAction<{ qid: string; ansid: string }>
    ) => {
      if (!state.selectedAnswers.some((e) => e.qid === action.payload.qid)) {
        state.selectedAnswers = [
          ...state.selectedAnswers,
          {
            qid: action.payload.qid,
            ansids: [action.payload.ansid],
          },
        ]
      }

      state.selectedAnswers = state.selectedAnswers.map((e) => {
        if (e.qid != action.payload.qid) return e

        return {
          ...e,
          ansids: [action.payload.ansid],
        }
      })
    },
    setProgState: (state, action: PayloadAction<QuizProgressState>) => {
      state.progState = action.payload
    },
    resetQuiz: (state) => (state = initialState),
  },
})

export const {
  setSelectedQuestion,
  toggleAnswer,
  setAnswer,
  setProgState,
  resetQuiz,
} = quizSlice.actions

export default quizSlice.reducer

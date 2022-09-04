import { Question, QuestionAnswer } from "@prisma/client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

interface CreateQuizState {
  title?: string
  questions?: Array<Question>
  answers?: Array<QuestionAnswer>
  currentStep: CreateQuizSteps
}

export enum CreateQuizSteps {
  writingTitle,
  creatingQuestions,
}

const initialState: CreateQuizState = {
  currentStep: CreateQuizSteps.writingTitle,
}

export const selectCurrentStep = (state: RootState) =>
  state.createQuiz.currentStep

export const createQuizSlice = createSlice({
  name: "create-quiz",
  initialState,
  reducers: {
    blabla: (state, action: PayloadAction) => {},
  },
})

export const { blabla } = createQuizSlice.actions

export default createQuizSlice.reducer

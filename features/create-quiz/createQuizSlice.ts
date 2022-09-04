import { Question, QuestionAnswer } from "@prisma/client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

interface CreateQuizState {
  title?: string
  questions?: Array<Question>
  answers?: Array<QuestionAnswer>
  currentStep: CreateQuizStep
}

export enum CreateQuizStep {
  writingTitle,
  creatingQuestions,
}

const initialState: CreateQuizState = {
  currentStep: CreateQuizStep.writingTitle,
}

export const selectCurrentStep = (state: RootState) =>
  state.createQuiz.currentStep

export const createQuizSlice = createSlice({
  name: "create-quiz",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<CreateQuizStep>) => {
      state.currentStep = action.payload
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
  },
})

export const { setTitle, setStep } = createQuizSlice.actions

export default createQuizSlice.reducer

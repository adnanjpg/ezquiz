import { Question, QuestionAnswer } from "@prisma/client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface CreateQuizState {
  title?: string
  questions?: Array<Question>
  answers?: Array<QuestionAnswer>
}

const initialState: CreateQuizState = {}

export const createQuizSlice = createSlice({
  name: "create-quiz",
  initialState,
  reducers: {
    blabla: (state, action: PayloadAction) => {},
  },
})

export const { blabla } = createQuizSlice.actions

export default createQuizSlice.reducer

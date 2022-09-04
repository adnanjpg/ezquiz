import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import quizReducer from '../features/quiz/quizSlice'
import createQuizReducer from '../features/create-quiz/createQuizSlice'


export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    createQuiz: createQuizReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

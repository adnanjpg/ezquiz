import { ChangeEvent, useState } from "react"

import { FaTimes } from "react-icons/fa"
import CenterVertical from "../../../app/comps/center-vertical"

import JoinComps from "../../../app/comps/join-comps"
import { useAppBatch, useAppDispatch, useAppSelector } from "../../../app/hooks"
import { trpc } from "../../../utils/trpc"
import {
  createAnswer,
  CreateQuizStep,
  selectCanAddAnswer,
  selectCurrentStep,
  setSelectedQuestionId,
  setStep,
  setTitle as setConfirmedTitle,
  selectCurrentQuestionAnswers,
  updateAnswer,
  removeAnswer,
  selectCurrentQuestion,
  selectAllQuestions,
  updateQuestion,
  selectCanAddQuestion,
  createQuestion,
  selectIsAnswerCorrectCQ,
  setAnswerIsCorrect,
} from "../createQuizSlice"

export default () => {
  const step = useAppSelector(selectCurrentStep)

  if (step === CreateQuizStep.writingTitle) return <QuizTitle />
  if (step === CreateQuizStep.creatingQuestions) return <AddQuestions />

  return <></>
}

function QuizTitle() {
  const dispatch = useAppDispatch()

  const [title, setSelectedTitle] = useState("")

  const onClick = () => {
    useAppBatch(() => {
      dispatch(setConfirmedTitle(title))
      dispatch(createQuestion)
      dispatch(setStep(CreateQuizStep.creatingQuestions))
    })
  }

  const isValid = title.length > 3

  return (
    <JoinComps
      className="flex flex-col items-center justify-center h-screen"
      joint={<div className="my-3"></div>}
    >
      <div className="text-xl">Give a title to your quiz</div>
      <input
        placeholder="My Cool Quiz"
        className="m-1 p-3"
        value={title}
        onChange={(event) => setSelectedTitle(event.target.value)}
      ></input>
      <button disabled={!isValid} onClick={onClick} className="primary-button">
        Next
      </button>
    </JoinComps>
  )
}

function AddQuestions() {
  return (
    <div className="flex flex-col  h-screen">
      <div className="grow">
        <ShowSelectedQuestion />
      </div>

      <div className="h-40">
        <ShowSelectableQuestions />
      </div>
    </div>
  )
}

function ShowSelectedQuestion() {
  return (
    <CenterVertical className="items-center">
      <QuestionTitle />
      <hr className="w-40 m-4 border-solid" />
      <Answers />
    </CenterVertical>
  )
}

function QuestionTitle() {
  const dispatch = useAppDispatch()

  const question = useAppSelector(selectCurrentQuestion)

  if (!question) throw new Error("NO QUESTION")

  const text = question.text

  const onChangeSetTitle = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateQuestion({
        ...question,
        text: event.target.value,
      })
    )
  }
  return (
    <input
      placeholder="Question Title"
      value={text ?? ""}
      onChange={onChangeSetTitle}
    />
  )
}

function Answers() {
  const canAddAnswer = useAppSelector(selectCanAddAnswer)

  const dispatch = useAppDispatch()

  const onClickAddAns = () => {
    dispatch(createAnswer())
  }

  const answers = useAppSelector(selectCurrentQuestionAnswers) ?? []

  return (
    <>
      <div>Answers</div>
      <>
        {answers.map((answer) => (
          <AnswerItem key={answer.id} id={answer.id}></AnswerItem>
        ))}
      </>
      <>
        {canAddAnswer && (
          <button className="primary-button" onClick={onClickAddAns}>
            Add answer
          </button>
        )}
      </>
    </>
  )
}

function AnswerItem(props: { id: string }) {
  const id = props.id

  const answers = useAppSelector(selectCurrentQuestionAnswers) ?? []
  const answer = answers.find((e) => e.id === id)

  if (!answer) throw new Error("INVALID ANSWER")

  const ansid = answer.id

  const iscorrect = useAppSelector((state) =>
    selectIsAnswerCorrectCQ({ state: state, ansid })
  )

  const dispatch = useAppDispatch()

  const onChangeUpdateAnswer = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(updateAnswer({ ...answer, text: event.target.value }))

  const onClickRemoveAnswer = () => dispatch(removeAnswer(id))

  const onChangeIsCorrect = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist()

    const isc = event.target.checked

    dispatch(
      setAnswerIsCorrect({
        id: ansid,
        iscorrect: isc,
      })
    )
  }

  return (
    <div>
      <input onChange={onChangeUpdateAnswer} value={answer.text || ""} />
      <input
        type="checkbox"
        checked={iscorrect === true}
        onChange={onChangeIsCorrect}
      />

      <button onClick={onClickRemoveAnswer}>
        <FaTimes />
      </button>
    </div>
  )
}

function ShowSelectableQuestions() {
  const questions = useAppSelector(selectAllQuestions)

  const ids = questions?.map((e) => e.id)

  if (!ids) return <></>

  return (
    <div>
      <div className="max-w-full flex flex-wrap ">
        {ids?.map((id) => (
          <ShowSelectableQuestion key={id} id={id} />
        ))}
      </div>
      <div className="flex flex-row justify-center my-4">
        <AddQuestionButton />
        <span className="w-4"></span>
        <SubmitQuiz />
      </div>
    </div>
  )
}

function AddQuestionButton() {
  const canAddQuestion = useAppSelector(selectCanAddQuestion)

  if (!canAddQuestion) return <></>

  const dispatch = useAppDispatch()

  const onClickAdd = () => {
    dispatch(createQuestion())
  }

  return (
    <button onClick={onClickAdd} className="secondary-button">
      Add Question
    </button>
  )
}

function SubmitQuiz() {
  const mutation = trpc.useMutation(["quiz.create"])
  const quests = useAppSelector(selectAllQuestions)

  if (!quests) throw new Error("NO QUESTIONS")

  const onClickSubmitQuiz = () => {
    mutation.mutate({
      questions: quests.map((quest) => {
        const anss = quest.answers ?? []
        return {
          text: quest.text ?? "",
          answers: anss.map((ans) => {
            return {
              text: ans.text ?? "",
              iscorrect: true,
            }
          }),
        }
      }),
    })
  }

  return (
    <>
      <button
        disabled={mutation.isLoading}
        onClick={onClickSubmitQuiz}
        className="primary-button"
      >
        Submit
      </button>
      {mutation.isSuccess && <span>Submitted successfully!!</span>}
      {mutation.isError && <span>{mutation.error.message}</span>}
    </>
  )
}

function ShowSelectableQuestion(props: { id: string }) {
  const dispatch = useAppDispatch()

  const id = props.id

  const switchToQuestion = () => dispatch(setSelectedQuestionId(id))

  return (
    <span className="bg-cool px-2 py-2 mx-1 rounded-md cursor-pointer" key={id}>
      <a>
        <span className="text-white" onClick={switchToQuestion}>
          {id}
        </span>
      </a>
    </span>
  )
}

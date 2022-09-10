import { ChangeEvent, useState } from "react"

import { FaTimes } from "react-icons/fa"

import CenterHorizontal from "../../../app/comps/center-horizontal"
import CenterVertical from "../../../app/comps/center-vertical"
import JoinComps from "../../../app/comps/join-comps"
import { useAppBatch, useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  createAnswer,
  addQuestion,
  CreateQuizStep,
  selectCanAddAnswer,
  selectCurrentStep,
  setSelectedQuestionId,
  setStep,
  setTitle as setConfirmedTitle,
  selectCurrentQuestionAnswers,
  updateAnswer,
  removeAnswer,
} from "../createQuizSlice"

export default () => {
  const step = useAppSelector(selectCurrentStep)

  if (step === CreateQuizStep.writingTitle) return <QuizTitle></QuizTitle>
  if (step === CreateQuizStep.creatingQuestions)
    return <AddQuestions></AddQuestions>

  return <></>
}

function QuizTitle() {
  const dispatch = useAppDispatch()

  const [title, setSelectedTitle] = useState("")

  const onClick = () => {
    useAppBatch(() => {
      dispatch(setConfirmedTitle(title))
      dispatch(addQuestion({ id: "1" }))
      dispatch(setSelectedQuestionId("1"))
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
  const [qtitle, setqtitle] = useState("")

  return (
    <CenterVertical>
      <CenterHorizontal>
        <QuestionTitle />
        <hr className="w-40 m-4 border-solid" />
        <Answers />
      </CenterHorizontal>
    </CenterVertical>
  )
}

function QuestionTitle() {
  const [qtitle, setqtitle] = useState("")

  return (
    <input
      placeholder="Question Title"
      value={qtitle}
      onChange={(event) => setqtitle(event.target.value)}
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

  const dispatch = useAppDispatch()

  const onChangeUpdateAnswer = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(updateAnswer({ ...answer, text: event.target.value }))

  const onClickRemoveAnswer = () => dispatch(removeAnswer(id))

  return (
    <div>
      <input onChange={onChangeUpdateAnswer} value={answer.text || ""} />
      <button onClick={onClickRemoveAnswer}>
        <FaTimes />
      </button>
    </div>
  )
}

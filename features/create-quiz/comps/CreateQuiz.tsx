import { useState } from "react"
import CenterHorizontal from "../../../app/comps/center-horizontal"
import CenterVertical from "../../../app/comps/center-vertical"
import JoinComps from "../../../app/comps/join-comps"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  CreateQuizStep,
  selectCurrentStep,
  setStep,
  setTitle as setConfirmedTitle,
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
    dispatch(setConfirmedTitle(title))
    dispatch(setStep(CreateQuizStep.creatingQuestions))
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
        <input
          placeholder="Question Title"
          value={qtitle}
          onChange={(event) => setqtitle(event.target.value)}
        ></input>
      </CenterHorizontal>
    </CenterVertical>
  )
}

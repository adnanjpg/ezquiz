import CenterVertical from "../../../app/comps/center-vertical"
import JoinComps from "../../../app/comps/join-comps"
import { useAppSelector } from "../../../app/hooks"
import { CreateQuizSteps, selectCurrentStep } from "../createQuizSlice"

export default () => {
  const step = useAppSelector(selectCurrentStep)

  if (step === CreateQuizSteps.writingTitle) return QuizTitle()

  return <></>
}

function QuizTitle() {
  return (
    <JoinComps
      className="flex flex-col items-center justify-center h-screen"
      joint={<div className="my-3"></div>}
    >
      <div className="text-xl">Give a title to your quiz</div>
      <input placeholder="My Cool Quiz" className="m-1 p-3"></input>
      <button className="primary-button">Next</button>
    </JoinComps>
  )
}

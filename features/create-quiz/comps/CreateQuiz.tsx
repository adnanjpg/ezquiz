import CenterVertical from "../../../app/comps/center-vertical"

export default () => {
  return (
    <CenterVertical>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-xl">Give a title to your quiz</div>
        <div className="my-4"></div>
        <input placeholder="My Cool Quiz" className="m-1 p-3"></input>
      </div>
    </CenterVertical>
  )
}

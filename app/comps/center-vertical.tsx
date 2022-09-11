export default (props: {
  children?: JSX.Element | JSX.Element[]
  className?: string
}): JSX.Element => {
  return (
    <div
      className={
        `flex flex-col h-full justify-center` + " " + (props.className ?? "")
      }
    >
      <div className="my-auto">{props.children}</div>
    </div>
  )
}

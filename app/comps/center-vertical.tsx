export default (props: {
  children?: JSX.Element | JSX.Element[]
}): JSX.Element => {
  return (
    <div className="flex flex-col h-full justify-center">
      <div className="my-auto">{props.children}</div>
    </div>
  )
}

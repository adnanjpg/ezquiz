export default (props: {
  children?: JSX.Element | JSX.Element[]
}): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {props.children}
    </div>
  )
}

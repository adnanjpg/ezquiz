export const ErrorViewPage = (props: { error: { message: string } }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <ErrorView error={props.error} />
    </div>
  )
}

export const ErrorView = (props: { error: { message: string } }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-xl text-orange-600">{props.error.message}</span>
    </div>
  )
}

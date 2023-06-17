import Quiz from "~/features/quiz/comps/Quiz"
import { useRouter } from "next/router"
import Head from "next/head"
import { LoadingPage } from "~/components/loader"
import { ErrorViewPage } from "~/components/errorView"
import { setQuiz } from "~/features/quiz/quizSlice"
import { useAppDispatch } from "~/app/hooks"
import { api } from "~/utils/api"

export default () => {
  const { query, isReady } = useRouter()

  if (!isReady) return <LoadingPage />

  const id = query.id

  const invalidUrl = () => {
    return (
      <>
        <Head>
          <title>Invalid url</title>
        </Head>
        <div>invalid url</div>
      </>
    )
  }

  if (!id) {
    return invalidUrl()
  }

  let numId: number
  try {
    numId = parseInt(id as string)

    if (isNaN(numId)) {
      return invalidUrl()
    }
  } catch {
    return invalidUrl()
  }

  const { data, isLoading, isError, error } = api.quizzes.get.useQuery({
    id: numId,
  })

  if (isLoading) return <LoadingPage />

  if (isError) return <ErrorViewPage error={{ message: error.message }} />

  const dispatch = useAppDispatch()
  dispatch(setQuiz(data!))

  return (
    <>
      <Head>
        <title>{data!.title}</title>
      </Head>

      <Quiz />
    </>
  )
}

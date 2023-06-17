import { Quiz } from "@prisma/client"
import type { NextPage } from "next"
import { ErrorViewPage } from "~/components/errorView"
import { LoadingPage } from "~/components/loader"
import { api } from "~/utils/api"
import { ChevronRight } from "@mui/icons-material"
import Link from "next/link"
import Head from "next/head"

const QuizList = () => {
  const { data, isLoading, isError, error } = api.quizzes.list.useQuery()

  if (isLoading) return <LoadingPage />

  if (isError) return <ErrorViewPage error={{ message: error.message }} />

  return (
    <>
      <Head>
        <title>Quiz list</title>
      </Head>
      <h1 className="my-8 text-xl text-center">Quiz list</h1>
      <>
        {data.map((quiz) => (
          <QuizItem quiz={quiz} />
        ))}
      </>
    </>
  )
}

const QuizItem = (props: { quiz: Quiz }) => {
  const quizId = props.quiz.id

  return (
    <Link href={`/${quizId}`}>
      <div className="rounded-lg bg-slate-50 p-5 m-3">
        <div className="flex flex-row">
          <h2 className="flex-grow">{props.quiz.title}</h2>
          <span className="min-w-fit">
            <ChevronRight />
          </span>
        </div>
      </div>
    </Link>
  )
}

const Home: NextPage = () => <QuizList />
export default Home

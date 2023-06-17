import Quiz from "~/features/quiz/comps/Quiz"
import { useRouter } from "next/router"

export default () => {
  const router = useRouter()

  const id = router.query.id

  const invalidUrl = () => {
    return <div>invalid url</div>
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

  return <Quiz id={numId}></Quiz>
}

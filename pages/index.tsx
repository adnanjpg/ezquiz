
import type { NextPage } from 'next'
import Head from 'next/head'
import Quiz from '../features/quiz/comps/Quiz'

import { trpc } from '../utils/trpc'

// export default function IndexPage() {
//   const hello = trpc.useQuery(['hello', { text: 'client' }])
//   if (!hello.data) {
//     return <div>Loading...</div>
//   }

//   return (
//     <div>
//       <p>{hello.data.greeting}</p>
//     </div>
//   )
// }



const Home: NextPage = () => {
  return (
    <div className="App">
      <Quiz></Quiz>
    </div>
  )
}

export default Home

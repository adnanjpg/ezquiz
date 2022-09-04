import type { NextPage } from 'next'
import Head from 'next/head'
import Quiz from '../features/quiz/comps/Quiz'

const Home: NextPage = () => {
  return (
    <div className="App">
      <Quiz></Quiz>
    </div>
  )
}

export default Home

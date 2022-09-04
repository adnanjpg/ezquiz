import { NextPage } from "next"
import CreateQuiz from "../features/create-quiz/comps/CreateQuiz"
import { trpc } from "../utils/trpc"

const CreatePage: NextPage = () => {
  // const mutation = trpc.useMutation(['quiz.create'])

  // const onClick = () => {
  //     mutation.mutate({
  //         questions: [
  //             {
  //                 text: 'lorem ipsum',
  //                 answers: [
  //                     {
  //                         text: 'dolor sit amet',
  //                         iscorrect: true,
  //                     },
  //                     {
  //                         text: 'consectetur adipiscing elit',
  //                         iscorrect: false,
  //                     },
  //                     {
  //                         text: 'Aenean eleifend',
  //                         iscorrect: true,
  //                     },
  //                 ]
  //             },
  //             {
  //                 text: 'dolor sit amet',
  //                 answers: [
  //                     {
  //                         text: 'consectetur adipiscing elit',
  //                         iscorrect: false,
  //                     },
  //                     {
  //                         text: 'Aenean eleifend',
  //                         iscorrect: true,
  //                     },
  //                     {
  //                         text: 'ex ac ullamcorper malesuada,',
  //                         iscorrect: false,
  //                     },
  //                 ]
  //             }
  //         ]
  //     })
  // }

  return <CreateQuiz></CreateQuiz>
}

export default CreatePage

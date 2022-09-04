
import { NextPage } from 'next'
import { trpc } from '../utils/trpc'

const CreatePage: NextPage = () => {
    const mutation = trpc.useMutation(['quiz.create'])

    const onClick = () => {
        mutation.mutate({
            questions: [
                {
                    text: 'lorem ipsum',
                    answers: [
                        {
                            text: 'dolor sit amet',
                            iscorrect: true,
                        },
                        {
                            text: 'consectetur adipiscing elit',
                            iscorrect: false,
                        },
                        {
                            text: 'Aenean eleifend',
                            iscorrect: true,
                        },
                    ]
                },
                {
                    text: 'dolor sit amet',
                    answers: [
                        {
                            text: 'consectetur adipiscing elit',
                            iscorrect: false,
                        },
                        {
                            text: 'Aenean eleifend',
                            iscorrect: true,
                        },
                        {
                            text: 'ex ac ullamcorper malesuada,',
                            iscorrect: false,
                        },
                    ]
                }
            ]
        })
    }

    return (
        <div>
            <button onClick={onClick} disabled={mutation.isLoading}>Add Quiz</button>
            {mutation.data && <p>Last Added quiz id: {mutation.data.id}</p>}
            {mutation.error && <p>Something went wrong! {mutation.error.message}</p>}
        </div>

        //   <p>{hello.data.greeting}</p>
    )
}

export default CreatePage

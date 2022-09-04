/**
when you wanna wrap a component with the same 2 components,
e.g. when using a flexbox to keep an element in the center of the
screen, in this case the element is the `filling`, you want to
sandwich it between 2 elements of specific width, in this case the
`bun`
*/
export default (props: { bun: JSX.Element, children: JSX.Element }): JSX.Element => {

    return (
        <>
            {props.bun}
            {props.children}
            {props.bun}
        </>
    )
}
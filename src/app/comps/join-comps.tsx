/**
 This component takes a will put the `joint`
 between each of its children. the only
 use case I find for this component is to
 join some components with spacing, w/o having
 to specify margin to each of them manually.
 example:
 ```js
 <JoinComps joint={<div className="my-3"></div>}>
    <div>Hi</div>
    <div>World</div>
    <div>!</div>
 </JoinComps>
 ```
 in this exaple there will be 12px(my-3) vertical space
 between each of the components
 */

export default (props: {
  joint: JSX.Element
  children?: JSX.Element | JSX.Element[]
  className?: string
}): JSX.Element => {
  const children = props.children
    ? props.children.constructor.name == "Array"
      ? (props.children as JSX.Element[])
      : [props.children as JSX.Element]
    : (new Array() as Array<JSX.Element>)

  const newChildren = new Array() as Array<JSX.Element>

  let compid = 0

  for (let i = 0; i < children.length; i++) {
    const isLast = i + 1 === children.length

    const element = children[i]

    if (!element) continue

    newChildren.push(element)

    if (!isLast) {
      newChildren.push(
        <div key={"joint_with_id" + compid++}>{props.joint}</div>,
      )
    }
  }

  return <div className={props.className}>{newChildren}</div>
}

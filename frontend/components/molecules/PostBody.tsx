import { H1 } from "components/atoms/H1"

export const PostBody = ({reTitle, title, sender, timestamp, text}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
          <div>{reTitle}</div>
          <H1 text={title} />
          <div>
            <div>{sender}</div>
            <div>{timestamp}</div>
          </div>
          <p className="my-2">{text}</p>
        </div>
  )
}

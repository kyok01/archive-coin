import { H1 } from "components/atoms/H1";
import Image from "next/image";

export const PostBody = ({ reTitle, title, sender, timestamp, text }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {reTitle && (
        <div className="flex items-center">
          <div className="inline-box mr-1">
            <Image src="/replyIcon.png" alt="" width={16} height={16} />
          </div>
          <div className="inline-box">{reTitle}</div>
        </div>
      )}

      <H1 text={title} />
      <div>
        <div>{sender}</div>
        <div>{timestamp}</div>
      </div>
      <p className="my-2">{text}</p>
    </div>
  );
};

import { SimpleCard } from "components/atoms/SimpleCard";
import Link from "next/link";

export const MyPosts = ({ posts, repSum }) => {
  return (
    <>
      {posts.map((p, i) => (
        <Link href={`/posts/${p.pId}`} key={i}>
          <div className="m-2">
            <SimpleCard
              title={
                p.title.length > 14 ? p.title.substring(0, 14) + "..." : p.title
              }
              text={
                p.text.length > 100 ? p.text.substring(0, 100) + "..." : p.text
              }
              sender={p.sender.substring(0, 14) + "..."}
              timestamp={p.timestamp}
              status={`${repSum[p.pId]} Rep`}
            />
          </div>
        </Link>
      ))}
    </>
  );
};

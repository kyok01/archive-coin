import { GetServerSideProps } from "next";

import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { useState, useEffect } from "react";
import { postType } from "types/postType";
import { Navbar } from "components/organisms/NavBar";
import { filter } from "util/filterArr";
import { WritePostForm } from "components/organisms/WritePostForm";
import { sendPost } from "util/sendPost";
import { sendComment } from "util/sendComment";
import { WriteCommentForm } from "components/organisms/WriteCommentForm";
import { SimpleCard } from "components/atoms/SimpleCard";
import { CommentCard } from "components/atoms/CommentCard";
import { PostBody } from "components/molecules/PostBody";
import { getPostForPId } from "util/getPostForPId";
import { getContract } from "util/getContract";
import { getAllPosts } from "util/getAllPosts";
import { getAllComments } from "util/getAllComments";

export default ({ pId }) => {
  const [post, setPost] = useState<postType>({});
  const [repPs, setRepPs] = useState([]);
  const [repCs, setRepCs] = useState([]);
  const [reTitle, setReT] = useState<string>("");
  const [tab, setTab] = useState<number>(1);
  const [repSum, setRepSum] = useState([]);

  useEffect(() => {
    getPostForPIdFunc();
    getReplies();
  }, []);

  async function getPostForPIdFunc() {
    const contract = await getContract(contractAddress, Artifact);
    const post = await getPostForPId(pId, contract);
    getReplyToInfo(post.replyTo);
    setPost(post);
  }

  async function getReplyToInfo(replyTo) {
    const contract = await getContract(contractAddress, Artifact)
    let transaction = await contract.getPostForPId(replyTo);
    setReT(transaction.title);
  }

  async function getReplies() {
    await getRepPosts();
    await getRepComments();
  }

  async function getRepPosts() {
    const contract = await getContract(contractAddress, Artifact);
    const { posts, repCountArr } = await getAllPosts(contract);

    const repPosts = await filter(posts, async (p, i) => {
      const bool = p.replyTo == pId;
      console.log(bool);
      return bool;
    });

    setRepPs(repPosts);
    setRepSum(repCountArr);
  }

  async function getRepComments() {
    const contract = await getContract(contractAddress, Artifact);
    const comments = await getAllComments(contract);

    const repComments = await filter(comments, async (c, i) => {
      const bool = c.replyTo == pId;
      console.log(bool);
      return bool;
    });

    setRepCs(repComments);
  }



  return (
    <>
      <Navbar />
      <div className="mx-2">
        <PostBody
          reTitle={reTitle}
          title={post.title}
          sender={post.sender}
          timestamp={post.timestamp}
          text={post.text}
        />
      </div>

      {/* <div className="flex justify-center my-2">
        <button
          className="btn btn-secondary max-w-xs w-full"
          onClick={getReplies}
        >
          Show Replies
        </button>
      </div> */}
      <div className="flex justify-center flex-col items-center my-2">
        <h2 className="w-full max-w-4xl text-xl">返信コメント</h2>
        <div className="flex flex-start w-full max-w-4xl bg-accent px-8 py-2">
          <ul className="list-inside" style={{ listStyle: "disc" }}>
            {repCs.map((repC, i) => (
              <li key={i}>
                {repC.sender}
                <CommentCard text={repC.text} />
              </li>
            ))}
          </ul>
        </div>

        <h2 className="w-full max-w-4xl text-xl">Reply Post</h2>

        <div className="flex justify-around flex-wrap w-full max-w-4xl bg-accent py-4">
          {repPs.map((repP, i) => (
            <SimpleCard
              title={
                repP.title.length > 14
                  ? repP.title.substring(0, 14) + "..."
                  : repP.title
              }
              text={
                repP.text.length > 100
                  ? repP.text.substring(0, 100) + "..."
                  : repP.text
              }
              sender={repP.sender.substring(0, 14) + "..."}
              timestamp={repP.timestamp}
              status={`${repSum[repP.pId]} Rep`}
              key={i}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center my-2 flex-col">
        <div className="btn-group">
          <button
            className={`btn w-40 ${tab === 1 && "btn-active"}`}
            onClick={() => setTab(1)}
          >
            Reply as Post
          </button>
          <button
            className={`btn w-40 ${tab === 2 && "btn-active"}`}
            onClick={() => setTab(2)}
          >
            Comment
          </button>
        </div>
      </div>
      <div className="mx-2">
        {tab === 1 && <WritePostForm onSubmit={(e) => sendPost(pId, e)} />}
        {tab === 2 && (
          <WriteCommentForm onSubmit={(e) => sendComment(pId, e)} />
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return { props: { pId: id } };
};

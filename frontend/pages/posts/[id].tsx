/* eslint import/order: 0, import/no-unresolved: 0 */

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
import { ReplyPostList } from "components/organisms/ReplyPostList";
import { getRepPosts } from "util/getRepPosts";
import Link from "next/link";

export default function PostsId({ pageId }) {
  const [post, setPost] = useState<postType>({});
  const [repPs, setRepPs] = useState([]);
  const [repCs, setRepCs] = useState([]);
  const [reTitle, setReT] = useState<string>("");
  const [tab, setTab] = useState<number>(1);
  const [repSum, setRepSum] = useState([]);
  const [openPId, setOpenPId] = useState([]);

  useEffect(() => {
    getPostForPIdFunc();
    getReplies();
  }, []);

  async function getPostForPIdFunc() {
    const contract = await getContract(contractAddress, Artifact);
    const post = await getPostForPId(pageId, contract);
    getReplyToInfo(post.replyTo);
    setPost(post);
  }

  async function getReplyToInfo(replyTo) {
    const contract = await getContract(contractAddress, Artifact);
    let transaction = await contract.getPostForPId(replyTo);
    setReT(transaction.title);
  }

  async function getReplies() {
    await getAndSetRepPosts();
    // await getRepComments();
  }

  
  async function getAndSetRepPosts() {
    const contract = await getContract(contractAddress, Artifact);
    const {repPosts, repCountArr} = await getRepPosts(pageId, contract);

    setRepPs(repPosts);
    setRepSum(repCountArr);
  }
  // async function getRepComments() {
  //   const contract = await getContract(contractAddress, Artifact);
  //   const comments = await getAllComments(contract);

  //   const repComments = await filter(comments, async (c, i) => {
  //     const bool = c.replyTo == pId;
  //     console.log(bool);
  //     return bool;
  //   });

  //   setRepCs(repComments);
  // }

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
        <h2 className="w-full max-w-4xl text-xl">Reactions</h2>
        <div className="flex flex-start w-full max-w-4xl bg-accent px-8 py-2">
          <ul className="list-inside" style={{ listStyle: "disc" }}>
            {repPs.map((repP, i) => (
              <li key={i}>
                <Link href={`/accounts/${repP.sender}`}>{repP.sender.substring(0, 14) + "..."}</Link>
                {/* TODO: we should change a tag into something good for frontend*/}
                <a href={`/posts/${repP.pId}`} ><CommentCard text={repP.text} /></a>
                {repSum[repP.pId] > 0 && !openPId.includes(repP.pId) && (
                  <p className="text-left pl-2 text-primary">
                    <span
                      onClick={() => setOpenPId([...openPId, repP.pId])}
                    >{`▼ ${repSum[repP.pId]} REPLIES`}</span>
                  </p>
                )}
                {repSum[repP.pId] > 0 && openPId.includes(repP.pId) && (
                  <p className="text-left pl-2 text-primary">
                    <span
                      onClick={() => setOpenPId(openPId.filter((o) => o!== repP.pId))}
                    >{`▲ CLOSE REPLIES`}</span>
                  </p>
                )}
                {openPId.includes(repP.pId) && <div className="ml-4"><ReplyPostList pId={repP.pId} repSum={repSum} setOpenPId={setOpenPId} openPId={openPId}/></div>}
              </li>
            ))}
          </ul>
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
        {tab === 1 && <WritePostForm onSubmit={(e) => sendPost(pageId, e)} />}
        {tab === 2 && (
          <WriteCommentForm onSubmit={(e) => sendComment(pageId, e)} />
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return { props: { pageId: id } };
};

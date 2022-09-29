/* eslint import/order: 0, import/no-unresolved: 0 */

import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";


import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { postType } from "types/postType";
import { Navbar } from "components/organisms/NavBar";
import { filter } from "util/filterArr";
import { SimpleCard } from "components/atoms/SimpleCard";
import Link from "next/link";
import { CommentCard } from "components/atoms/CommentCard";
import { H1 } from "components/atoms/H1";
import { getAllPosts } from "util/getAllPosts";
import { getContract } from "util/getContract";
import { getAllComments } from "util/getAllComments";

export default function AccountId ({ pId }) {
  const [posts, setPosts] = useState<postType[]>([]);
  const [comments, setComments] = useState([]);
  const [repSum, setRepSum] = useState([]);
  const [tab, setTab] = useState<number>(1);

  useEffect(() => {
    getAllPostsForAccount();
    getAllCommentsForAccount();
  }, []);

  async function getAllPostsForAccount() {
    const contract = await getContract(contractAddress, Artifact);
    const { posts, repCountArr } = await getAllPosts(contract);

    const postsForA = await filter(posts, async (c, i) => {
      const bool = c.sender == pId;
      console.log(bool);
      return bool;
    });
    setPosts(postsForA);
    setRepSum(repCountArr);
  }

  async function getReplyToInfo(replyTo: number) {
    const contract = await getContract(contractAddress, Artifact);
    let transaction = await contract.getPostForPId(replyTo);
    return transaction.title;
  }

  async function getAllCommentsForAccount() {
    const contract = await getContract(contractAddress, Artifact);
    const comments = await getAllComments(contract);

    const commentsForA = await filter(comments, async (c, i) => {
      const bool = c.sender == pId;
      console.log(bool);
      return bool;
    });

    const commentsForAWithRep = await Promise.all(
      commentsForA.map(async (c, i) => {
        const repTitle = await getReplyToInfo(c.replyTo);
        const item = {
          cId: c.cId,
          text: c.text,
          sender: c.sender,
          replyTo: c.replyTo,
          timestamp: c.timestamp,
          repTitle,
        };
        return item;
      })
    );

    setComments(commentsForAWithRep);
  }

  return (
    <>
      <Navbar />
      <div className="w-5/6 m-auto flex justify-center">
        <H1 text={pId} />
      </div>
      <div className="flex justify-center">
        <div className="tabs">
          <a
            className={`tab tab-bordered ${tab === 1 && "tab-active"} `}
            onClick={() => setTab(1)}
          >
            Posts
          </a>
          <a
            className={`tab tab-bordered ${tab === 2 && "tab-active"}`}
            onClick={() => setTab(2)}
          >
            Comments
          </a>
        </div>
      </div>
      {tab === 1 && (
        <div className="flex justify-around flex-wrap w-5/6 m-auto">
          {posts.map((p, i) => (
            <Link href={`/posts/${p.pId}`} key={i}>
              <div className="m-2">
                <SimpleCard
                  title={
                    p.title.length > 14
                      ? p.title.substring(0, 14) + "..."
                      : p.title
                  }
                  text={
                    p.text.length > 100
                      ? p.text.substring(0, 100) + "..."
                      : p.text
                  }
                  sender={p.sender.substring(0, 14) + "..."}
                  timestamp={p.timestamp}
                  status={`${repSum[p.pId]} Rep`}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
      {tab === 2 && (
        <div className="flex justify-center">
          <div className="flex flex-start w-full max-w-4xl bg-accent px-8 py-2">
            <ul className="list-inside" style={{ listStyle: "disc" }}>
              {comments.map((comment, i) => (
                <Link href={`/posts/${comment.replyTo}`} key={i}>
                  <li>
                    <p>{comment.repTitle}</p>
                    <CommentCard text={comment.text} />
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return { props: { pId: id } };
};

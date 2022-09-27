import { GetServerSideProps } from "next";
import { ethers } from "ethers";

import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { useState, useEffect } from "react";
import { postType } from "types/postType";
import { Navbar } from "components/organisms/NavBar";
import { filter } from "util/filterArr";
import { SimpleCard } from "components/atoms/SimpleCard";
import Link from "next/link";
import { CommentCard } from "components/atoms/CommentCard";

export default ({ pId }) => {
  const [posts, setPosts] = useState<postType[]>([]);
  const [comments, setComments] = useState([]);
  const [repSum, setRepSum] = useState([]);
  const [tab, setTab] = useState<number>(1);

  useEffect(() => {
    getAllPostsForAccount();
    getAllCommentsForAccount();
  }, []);

  async function getAllPostsForAccount() {
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    const contract = new ethers.Contract(
      contractAddress.address,
      Artifact.abi,
      signer
    );
    //create an NFT Token
    const transaction = await contract.getAllPosts();

    const posts = await Promise.all(
      transaction.map(async (p, i) => {
        const dateTime = new Date(p.timestamp * 1000);
        let item = {
          pId: i + 1,
          title: p.title,
          text: p.text,
          sender: p.sender,
          replyTo: p.replyTo.toNumber(),
          timestamp: dateTime.toLocaleDateString(),
        };
        return item;
      })
    );

    const postsForA = await filter(posts, async (c, i) => {
      const bool = c.sender == pId;
      console.log(bool);
      return bool;
    });

    const arr = [...Array(posts.length + 1)].map((i) => 0);

    const postsWithRep = await Promise.all(
      posts.map(async (p, i, posts) => {
        p.replyTo != 0 && arr[p.replyTo]++;
        return p;
      })
    );
    setPosts(posts);
    setRepSum(arr);
  }

  async function getReplyToInfo(replyTo: number) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      contractAddress.address,
      Artifact.abi,
      signer
    );
    //create an NFT Token
    let transaction = await contract.getPostForPId(replyTo);
    return transaction.title;
  }

  async function getAllCommentsForAccount() {
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      contractAddress.address,
      Artifact.abi,
      signer
    );
    //create an NFT Token
    let transaction = await contract.getAllComments();

    console.log(transaction);

    const comments = await Promise.all(
      transaction.map(async (c, i) => {
        const dateTime = new Date(c.timestamp * 1000);
        let item = {
          cId: i + 1,
          text: c.text,
          sender: c.sender,
          replyTo: c.replyTo.toNumber(),
          timestamp: dateTime.toLocaleDateString(),
        };
        return item;
      })
    );
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

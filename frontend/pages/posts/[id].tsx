import { GetServerSideProps } from "next";
import { ethers } from "ethers";

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

export default ({ pId }) => {
  const [post, setPost] = useState<postType>({});
  const [repPs, setRepPs] = useState([]);
  const [repCs, setRepCs] = useState([]);
  const [reTitle, setReT] = useState<string>("");
  const [isRepP, setIsRepP] = useState(true);
  const [isRepC, setIsRepC] = useState(false);
  useEffect(() => {
    getPostForPId();
    // getAnswerForId();
  }, []);

  async function getPostForPId() {
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
    let transaction = await contract.getPostForPId(pId);
    const dateTime = new Date(transaction.timestamp * 1000);
    const post = {
      title: transaction.title,
      text: transaction.text,
      sender: transaction.sender,
      replyTo: transaction.replyTo.toNumber(),
      timestamp: dateTime.toLocaleDateString(),
    };

    console.log(post);
    getReplyToInfo(post.replyTo);
    setPost(post);
  }

  async function getReplyToInfo(replyTo) {
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
    setReT(transaction.title);
  }

  async function getRepPosts() {
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
    let transaction = await contract.getAllPosts();

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

    const repPosts = await filter(posts, async (p, i) => {
      const bool = p.replyTo == pId;
      console.log(bool);
      return bool;
    });

    setRepPs(repPosts);
  }

  async function getRepComments() {
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

    console.log(comments);
    

    const repComments = await filter(comments, async (c, i) => {
      const bool = c.replyTo == pId;
      console.log(bool);
      return bool;
    });

    setRepCs(repComments);
  }

  async function getReplies() {
    await getRepPosts();
    await getRepComments();
  }

  function clickRepP() {
    setIsRepP(true);
    setIsRepC(false);
  }

  function clickRepC() {
    setIsRepP(false);
    setIsRepC(true);
  }

  return (
    <>
      <Navbar />
      <div className="mx-2">
      <div className="w-full max-w-4xl mx-auto">
        <div>{reTitle}</div>
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <div>
          <div>{post.sender}</div>
          <div>{post.timestamp}</div>
        </div>
        <p className="my-2">{post.text}</p>
      </div>
      </div>

      <div className="flex justify-center my-2">
        <button
          className="btn btn-secondary max-w-xs w-full"
          onClick={getReplies}
        >
          Show Replies
        </button>
      </div>
      <div className="flex justify-center flex-col items-center my-2">
        {repPs.map((repP, i) => (
          <div key={i}>{repP.title}</div>
        ))}
        {repCs.map((repC, i) => (
          <div key={i}>{repC.text}</div>
        ))}
      </div>
      <div className="flex items-center my-2 flex-col">
        <div className="btn-group">
          <button className="btn btn-active w-40" onClick={() => clickRepP()}>
            Reply as Post
          </button>
          <button className="btn w-40" onClick={() => clickRepC()}>
            Comment
          </button>
        </div>
      </div>
      <div className="mx-2">
        {isRepP && <WritePostForm onSubmit={(e) => sendPost(pId, e)} />}
        {isRepC && <WriteCommentForm onSubmit={(e) => sendComment(pId, e)} />}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return { props: { pId: id } };
};

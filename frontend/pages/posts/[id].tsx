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
import { WriteCommentForm } from "components/organisms/WriteCommentForm";

export default ({ pId }) => {
  const [post, setPost] = useState<postType>({});
  const [repPs, setRepPs] = useState([]);
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
    const addr = await signer.getAddress();
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

  async function getReplies() {
    await getRepPosts();
  }

  //   async function getAnswerForId() {
  //     //After adding your Hardhat network to your metamask, this code will get providers and signers
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     //Pull the deployed contract instance
  //     let contract = new ethers.Contract(
  //       contractAddress.address,
  //       Artifact.abi,
  //       signer
  //     );
  //     //create an NFT Token
  //     let transaction = await contract.getAllAnswers();
  //     let answerIds = [];

  //     const rowAnswers = await filter(transaction, async (q, i) => {
  //       answerIds.push(i);
  //       const bool = (await q.tokenId.toNumber()) == pId;
  //       console.log(bool);
  //       return bool;
  //     });

  //     const answers = await Promise.all(
  //       rowAnswers.map(async (q, i) => {
  //         let item = {
  //           answerId: answerIds[i],
  //           text: q.text,
  //           sender: q.sender,
  //         };
  //         return item;
  //       })
  //     );
  //     console.log(answers);
  //     setA(answers);
  //   }

  //   async function handleSubmit(event) {
  //     // Stop the form from submitting and refreshing the page.
  //     event.preventDefault();

  //     try {
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       const signer = provider.getSigner();

  //       let contract = new ethers.Contract(
  //         contractAddress.address,
  //         Artifact.abi,
  //         signer
  //       );

  //       const answerText = event.target.answerText.value;
  //       const qacType = event.target.qacType.value;
  //       const qacId = event.target.qacId.value;

  //       let struct;
  //       if (qacType === "question") {
  //         struct = await contract.getQuestionForId(qacId);
  //       } else if (qacType === "answer") {
  //         struct = await contract.getAnswerForAnswerId(qacId);
  //       } else if (qacType === "comment") {
  //         struct = await contract.getCommentForCommentId(qacId);
  //       }
  //       const refAddr = struct.sender;

  //       let transaction = await contract.setAnswer(
  //         pId,
  //         answerText,
  //         qacType,
  //         qacId,
  //         refAddr
  //       );
  //       await transaction.wait();

  //       alert("Successfully listed your Answer!");
  //       location.reload();
  //     } catch (e) {
  //       alert("Upload error" + e);
  //     }
  //   }

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
      <div className="flex justify-center my-2">
        {repPs.map((repP, i) => (
          <div>{repP.title}</div>
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
        {isRepC && <WriteCommentForm onSubmit={(e) => sendPost(pId, e)} />}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return { props: { pId: id } };
};

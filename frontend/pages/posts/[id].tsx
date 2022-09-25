import { GetServerSideProps } from "next";
import { ethers } from "ethers";

import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { useState, useEffect } from "react";
import { postType } from "types/postType";

export default ({ pId }) => {
  const [post, setPost] = useState<postType>({});
  useEffect(() => {
    getQuesitonForId();
    // getAnswerForId();
  }, []);

  async function getQuesitonForId() {
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
    setPost(post);
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

  return (
    <div>
      //{" "}
      <div>
        // <p>{post.title}</p>
        //{" "}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return { props: { pId: id } };
};

// helper function
async function filter(arr, callback) {
  const fail = Symbol();
  return (
    await Promise.all(
      arr.map(async (item) => ((await callback(item)) ? item : fail))
    )
  ).filter((i) => i !== fail);
}

import { getContract } from "./getContract";

export async function getPostForPId(pId, contract) {
  let transaction = await contract.getPostForPId(pId);
  const dateTime = new Date(transaction.timestamp * 1000);
  const post = {
    title: transaction.title,
    text: transaction.text,
    sender: transaction.sender,
    replyTo: transaction.replyTo.toNumber(),
    timestamp: dateTime.toLocaleDateString(),
  };
  return post;
}

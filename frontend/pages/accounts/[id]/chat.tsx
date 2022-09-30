/* eslint import/order: 0, import/no-unresolved: 0 */
import { GetServerSideProps } from "next";
import ArtifactOfA from "@cont/ArchiveCoin.json";
import ArtifactOfN from "@cont/NftContract.json";
import contractAddress from "@cont/contract-address.json";
import { useEffect, useState } from "react";

import { PrimaryBtn } from "components/atoms/PrimaryBtn";
import { Navbar } from "components/organisms/NavBar";
import { WriteCommentForm } from "components/organisms/WriteCommentForm";

import { getContract } from "util/getContract";


export default function ChatPage({ pId }){
  const [nftContAdd, setNftContAdd] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getNftContractAddress(pId);
    nftContAdd && (getAllChats(nftContAdd), listenEvent());
  }, [nftContAdd]);
  async function getNftContractAddress(pId) {
    // TODO: have to make util function that returns signer
    try {
      const contract = await getContract(contractAddress, ArtifactOfA);
      const transaction = await contract.getEoaToContract(pId);
      console.log(transaction);
      transaction != "0x0000000000000000000000000000000000000000" &&
        setNftContAdd(transaction);
    } catch (e) {
      alert("Upload error" + e);
    }
  }
  async function mintNft() {
    const contract = await getContract(
      {
        address: nftContAdd,
      },
      ArtifactOfN
    );
    const price = await contract.getPrice();
    const transaction = await contract.safeMint(
      "https://gateway.pinata.cloud/ipfs/Qmaf2uy3q2orbSmNmUjwmniUh86zUKT3u6JjbmdZapqUMZ",
      { value: price }
    );
    await transaction.wait();
    alert("successfully mint");
  }

  async function chat(nftContAdd, event) {
    event.preventDefault();

    try {
      const contract = await getContract(
        {
          address: nftContAdd,
        },
        ArtifactOfN
      );

      const text = event.target.text.value;

      const transaction = await contract.sendValidatedMessage(text);
      await transaction.wait();

      alert("Successfully send your Comment!");
    } catch (e) {
      alert("Upload error" + e);
    }
  }

  async function getAllChats(nftContAdd) {
    const contract = await getContract(
      {
        address: nftContAdd,
      },
      ArtifactOfN
    );
    const _messages = await contract.getAllMessages();
    console.log(_messages);

    setMessages(_messages);
  }

  async function listenEvent() {
    const contract = await getContract(
      {
        address: nftContAdd,
      },
      ArtifactOfN
    );
    const filter = contract.filters.sendMessageEvent(null, null, null);
    contract.on(filter, (_id, _from, _message) => {
      console.log(`by ${_from}, ${_message}`);
      getAllChats(nftContAdd);
    });
  }
  return (
    <>
      <Navbar />

      <div className="flex flex-col justify-center items-center">
        <p>Post: {pId}</p>
        <p>nftContAdd: {nftContAdd}</p>
        <p>
          If you mint NFT of the contract registered by the account, you can
          paticipate in the annonymous chat.
        </p>
      </div>
      <div className="flex justify-center my-2">
        <PrimaryBtn type="submit" onClick={() => mintNft()}>
          Mint NFT
        </PrimaryBtn>
      </div>
      <div className="flex justify-center items-center flex-col my-2">
        {messages.map((m, i) => (
          <div key={i}>
            {m.message} by {m.from}
          </div>
        ))}
      </div>
      <WriteCommentForm onSubmit={(e) => chat(nftContAdd, e)} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return { props: { pId: id } };
};

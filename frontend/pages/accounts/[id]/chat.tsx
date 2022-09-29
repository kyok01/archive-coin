import { PrimaryBtn } from "components/atoms/PrimaryBtn";
import { Navbar } from "components/organisms/NavBar";
import { GetServerSideProps } from "next";
import { getContract } from "util/getContract";

import ArtifactOfA from "@cont/ArchiveCoin.json";
import ArtifactOfN from "@cont/NftContract.json";
import contractAddress from "@cont/contract-address.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { WriteCommentForm } from "components/organisms/WriteCommentForm";

export default ({ pId }) => {
  const [nftContAdd, setNftContAdd] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getNftContractAddress(pId);
    nftContAdd && getAllChats(nftContAdd);
  }, [nftContAdd]);
  async function getNftContractAddress(pId) {
    // TODO: have to make util function that returns signer
    const contract = await getContract(contractAddress, ArtifactOfA);
    const transaction = await contract.getEoaToContract(pId);
    console.log(transaction);

    setNftContAdd(transaction);
  }
  async function mintNft() {
    const contract = await getContract(
      {
        address: nftContAdd,
      },
      ArtifactOfN
    );
    const price = ethers.utils.parseEther("0.0001");
    await contract.safeMint(
      "https://gateway.pinata.cloud/ipfs/Qmaf2uy3q2orbSmNmUjwmniUh86zUKT3u6JjbmdZapqUMZ",
      { value: price }
    );
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
      await transaction.wait()

      alert("Successfully send your Comment!");
  }
  catch(e) {
      alert( "Upload error"+e )
  }
  }

  async function getAllChats(nftContAdd) {
    const contract = await getContract(
      {
        address: nftContAdd,
      },
      ArtifactOfN
    );
    const _message = await contract.owner();
    console.log(_message);
    
    // setMessages(_messages);
  }
  return (
    <>
      <Navbar />

      <div className="flex flex-col justify-center items-center">
        <p>Post: {pId}</p>
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
      <div>
        {messages.map((m, i)=>(<p>{m.message} by {m.sender}</p>))}
      </div>
      <WriteCommentForm onSubmit={(e) => chat(nftContAdd, e)} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return { props: { pId: id } };
};

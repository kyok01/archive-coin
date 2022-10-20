/* eslint import/order: 0, import/no-unresolved: 0 */
import { GetServerSideProps } from "next";
import ArtifactOfA from "@cont/ArchiveCoin.json";
import ArtifactOfN from "@cont/NftContract.json";
import contractAddress from "@cont/contract-address.json";
import { useEffect, useState } from "react";

import { PrimaryBtn } from "components/atoms/PrimaryBtn";
import { Navbar } from "components/organisms/NavBar";

import { getContract } from "util/getContract";
import { H1 } from "components/atoms/H1";
import { ProfileTab } from "components/organisms/ProfileTab";
import Image from "next/image";
import { ethers } from "ethers";

export default function MintNftPage({ pId }) {
  const [nftContAdd, setNftContAdd] = useState("");
  const [price, setPrice] = useState(0);
  // TODO: nft image and name, descriptions must be changable
  const data = {
    name: "DockHack TOKEN",
    description: "This is the DockHack Token made by kyok.",
  };

  useEffect(() => {
    getNftContractAddress(pId);
    nftContAdd && getPrice();
  }, [nftContAdd]);

  async function getNftContractAddress(pId) {
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

  async function getPrice() {
    const contract = await getContract(
      {
        address: nftContAdd,
      },
      ArtifactOfN
    );
    const _price = await contract.getPrice();
    setPrice(Number(ethers.utils.formatEther(_price)));
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

  return (
    <>
      <Navbar />
      <div className="w-5/6 m-auto flex justify-center">
        <H1 text={pId} />
      </div>
      <div className="flex justify-center">
        <ProfileTab pId={pId} tab={2} />
      </div>

      <div className="flex mx-auto mt-8 flex-wrap justify-center">
        <div className="flex justify-center w-80 mx-auto lg:w-2/5 lg:mx-2">
          <Image
            src="/nftImageSample.png"
            alt=""
            width="500"
            height="500"
            layout="intrinsic"
          />
        </div>
        <div className="mx-auto space-y-4 shadow-2xl rounded-lg border-1 p-5 w-80 lg:mx-2 lg:w-1/5">
          <div style={{ overflowWrap: "normal", wordBreak: "break-word" }}><div>Name</div><span className="text-xl italic">{data.name}</span></div>
          <div style={{ overflowWrap: "normal", wordBreak: "break-word" }}><div>Description</div><span className="italic"> {data.description}</span></div>
          <div style={{ overflowWrap: "normal", wordBreak: "break-word" }}>
            <div>Contract Address</div> 
             <span className="italic">{nftContAdd}</span>
          </div>
          <div>Price: <span className="italic">{price} ether</span></div>
          <div className="flex justify-center my-2">
            <PrimaryBtn type="submit" onClick={() => mintNft()}>
              Mint NFT
            </PrimaryBtn>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return { props: { pId: id } };
};

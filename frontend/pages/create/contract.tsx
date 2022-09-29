import { Navbar } from "components/organisms/NavBar";
import Image from "next/image";
import { getContract } from "util/getContract";
import ArtifactOfA from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { ethers } from "ethers";
import { CreateContractForm } from "components/organisms/CreateContractForm";
import { createNftContract } from "util/createContract";
import { useEffect, useState } from "react";
import { SecondaryBtn } from "components/atoms/SecondaryBtn";

export default () => {
    const [fee, setFee] = useState<number | string>("")
    const [cAddress, setCAddress] = useState<string>("")
    const [isCreated, setIsCreated] = useState<boolean>(false);
    useEffect(()=> {
        getFee();
    }, [])
  
    async function getFee() {
        const contract = await getContract(contractAddress, ArtifactOfA);
        const _fee = await contract.getFee();
        setFee(ethers.utils.formatEther(_fee));
    }

    async function createAndDisplayCAddress(e) {
        const transaction = await createNftContract(String(fee), e);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider
        .getTransactionReceipt(transaction.hash)
        .then(function (transactionReceipt) {
          setCAddress(transactionReceipt.logs[0].address);
        });
        setIsCreated(true)
    }

    async function register(address) {
      const contract = await getContract(contractAddress, ArtifactOfA);
      const transaction = await contract.setEoaToContract(address);
      await transaction.wait();
      alert("successfully register")
      setIsCreated(false);
    }
  return (
    <>
      <Navbar />
      <p>To create chat, you have to deploy a contract of ERC-721(NFT).</p>
      <p>Contract creation fee is {fee} ether.</p>
      <p>You can select your NFT mint price.</p>
      <p>{cAddress}</p>
      <CreateContractForm onSubmit={(e)=>createAndDisplayCAddress(e)}/>
      {isCreated && <div><p>You have created! well done! Please register your contract address "{cAddress}".</p><SecondaryBtn type="button" onClick={()=>register(cAddress)}>Register</SecondaryBtn></div>}
    </>
  );
};

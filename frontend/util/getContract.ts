import { ethers } from "ethers";
import { getSigner } from "./getSigner";

export async function getContract(contractAddress, Artifact) {
  const signer = await getSigner();
  //Pull the deployed contract instance
  const contract = new ethers.Contract(
    contractAddress.address,
    Artifact.abi,
    signer
  );
  return contract;
}
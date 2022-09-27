import { ethers } from "ethers";

export async function getContract(contractAddress, Artifact) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  //Pull the deployed contract instance
  const contract = new ethers.Contract(
    contractAddress.address,
    Artifact.abi,
    signer
  );
  return contract;
}
import { ethers } from "ethers";

export async function getSigner() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return signer;
}
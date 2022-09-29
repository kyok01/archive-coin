import { ethers } from "ethers";

import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";

export const createNftContract = async(fee, event) => {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault();

  try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let contract = new ethers.Contract(
          contractAddress.address,
          Artifact.abi,
          signer
        );
        
      const mintPrice = event.target.mintPrice.value;
     
      let transaction = await contract.createNftContract(ethers.utils.parseEther(mintPrice), {
        value: ethers.utils.parseEther(fee),
      });
      await transaction.wait()

      alert("Successfully create your contract!");
      return transaction;
  }
  catch(e) {
      alert( "Upload error"+e )
  }
}
import { ethers } from "ethers";

import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";

export const sendPost = async(pId, event) => {
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
        
      const addr = await signer.getAddress();

      const title = event.target.title.value;
      const text = event.target.text.value;
     
      let transaction = await contract.setPost(title, text, pId);
      await transaction.wait()

      alert("Successfully send your Post!");
  }
  catch(e) {
      alert( "Upload error"+e )
  }
}
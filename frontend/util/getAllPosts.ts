import { ethers } from "ethers";

export async function getAllPosts(contractAddress, Artifact) {
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(contractAddress.address, Artifact.abi, signer)
    //create an NFT Token
    const addr = await signer.getAddress();
    let transaction = await contract.getAllPosts();

    const posts = await Promise.all(transaction.map(async (p, i) => {
        const dateTime = new Date(p.timestamp * 1000);
        let item = {
            pId: i+1,
            title: p.title,
            text: p.text,
            sender: p.sender,
            replyTo: p.replyTo.toNumber(),
            timestamp: dateTime.toLocaleDateString()
        }
        return item;
    }));

    const repCountArr = [...Array(posts.length+1)].map(i => 0);

    const postsWithRep = await Promise.all(posts.map(async (p, i, posts) => {
        p.replyTo != 0 && repCountArr[p.replyTo]++;
        return p;
    }));

    return {posts, repCountArr}
}
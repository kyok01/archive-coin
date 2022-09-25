import { SimpleCard } from "components/atoms/SimpleCard";
import { Navbar } from "components/organisms/NavBar";

import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { useState, useEffect } from "react";

import { ethers } from "ethers";

export default () => {
    const [posts, setPosts] = useState([]);
    const [repSum, setRepSum] = useState([]);
    useEffect(() => {
        getAllPosts();
    }, []);

    async function getAllPosts() {
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

        const arr = [...Array(posts.length+1)].map(i => 0);

        const postsWithRep = await Promise.all(posts.map(async (p, i, posts) => {
            p.replyTo != 0 && arr[p.replyTo]++;
            return p;
        }));
        setPosts(posts);
        setRepSum(arr);
    }

    return (
        <div>
            <Navbar />
            <div className="flex justify-around flex-wrap w-5/6 m-auto">
            {posts.map((p, i) => (<div className="m-2" key={i}><SimpleCard title={p.title.length > 14 ? p.title.substring(0, 14) + "..." : p.title} text={p.text.length > 100 ? p.text.substring(0, 100) + "..." : p.text} sender={p.sender.substring(0, 14) + "..."} timestamp={p.timestamp} status={`${repSum[p.pId]} Rep`}/></div>)) }
            <SimpleCard title="aaa" text="aaa" sender="aaaa" timestamp="aa" status={`1Rep`}/>
            </div>
        </div>
    );
}
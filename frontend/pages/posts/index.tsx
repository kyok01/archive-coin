import { SimpleCard } from "components/atoms/SimpleCard";
import { Navbar } from "components/organisms/NavBar";
import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { getAllPosts } from "util/getAllPosts";

import { useState, useEffect } from "react";
import Link from "next/link";


export default () => {
    const [posts, setPosts] = useState([]);
    const [repSum, setRepSum] = useState([]);
    useEffect(() => {
        initial();
    }, []);

    async function initial() {
        const {posts, repCountArr} = await getAllPosts(contractAddress, Artifact);
        setPosts(posts);
        setRepSum(repCountArr);
    }

    return (
        <div>
            <Navbar />
            <div className="flex justify-around flex-wrap w-5/6 m-auto">
            {posts.map((p, i) => (<Link href={`/posts/${p.pId}`} key={i}><div className="m-2"><SimpleCard title={p.title.length > 14 ? p.title.substring(0, 14) + "..." : p.title} text={p.text.length > 100 ? p.text.substring(0, 100) + "..." : p.text} sender={p.sender.substring(0, 14) + "..."} timestamp={p.timestamp} status={`${repSum[p.pId]} Rep`}/></div></Link>)) }
            </div>
        </div>
    );
}
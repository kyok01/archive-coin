/* eslint import/order: 0, import/no-unresolved: 0 */

import { SimpleCard } from "components/atoms/SimpleCard";
import { Navbar } from "components/organisms/NavBar";
import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { getAllPosts } from "util/getAllPosts";
import { H1 } from "components/atoms/H1";
import { getContract } from "util/getContract";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PostsIndex() {
  const [posts, setPosts] = useState([]);
  const [repSum, setRepSum] = useState([]);
  useEffect(() => {
    initial();
  }, []);

  async function initial() {
    const contract = await getContract(contractAddress, Artifact);
    const { posts, repCountArr } = await getAllPosts(contract);
    setPosts(posts);
    setRepSum(repCountArr);
  }

  return (
    <div>
      <Navbar />
      <div className="w-5/6 m-auto">
        <H1 text="All Posts" />
      </div>
      <div className="flex justify-around flex-wrap w-5/6 m-auto">
        {posts.map((p, i) => (
          <Link href={`/posts/${p.pId}`} key={i}>
            <div className="m-2">
              <SimpleCard
                title={
                  p.title.length > 14
                    ? p.title.substring(0, 14) + "..."
                    : p.title
                }
                text={
                  p.text.length > 100
                    ? p.text.substring(0, 100) + "..."
                    : p.text
                }
                sender={p.sender.substring(0, 14) + "..."}
                timestamp={p.timestamp.slice(0,-3)}
                status={`${repSum[p.pId]} Rep`}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

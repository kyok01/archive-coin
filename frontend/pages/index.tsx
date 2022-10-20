/* eslint import/order: 0, import/no-unresolved: 0 */

import { Navbar } from "components/organisms/NavBar";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { getContract } from "util/getContract";
import styles from "../styles/Home.module.css";
import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { HeroWithFigure } from "components/organisms/HeroWithFigure";
import { useEffect, useState } from "react";
import { getAllPosts } from "util/getAllPosts";
import Link from "next/link";
import { SimpleCard } from "components/atoms/SimpleCard";

const Home: NextPage = () => {
  const [posts, setPosts] = useState([]);
  const [repSum, setRepSum] = useState([]);
  useEffect(() => {
    initial();
  }, []);

  async function initial() {
    const contract = await getContract(contractAddress, Artifact);
    const { posts, repCountArr } = await getAllPosts(contract);
    const revercePost = posts.reverse();
    setPosts(revercePost);
    setRepSum(repCountArr);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>DockHack Diary</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className="text-primary">DockHack Diary</span>
        </h1>
        <div className="mt-8">
          <HeroWithFigure />
        </div>
        <div className="flex justify-around flex-wrap w-5/6 m-auto mt-8">
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
                  timestamp={p.timestamp.slice(0, -3)}
                  status={`${repSum[p.pId]} Rep`}
                />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;

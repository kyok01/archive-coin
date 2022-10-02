import { CommentCard } from "components/atoms/CommentCard";
import React, { useEffect, useState } from "react";

import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { getContract } from "util/getContract";
import { getRepPosts } from "util/getRepPosts";
import Link from "next/link";

export const ReplyPostList = ({ pId, repSum, setOpenPId, openPId }) => {
  const [repPs, setRepPs] = useState([]);
  useEffect(() => {
    getAndSetRepPosts(pId);
  }, []);

  async function getAndSetRepPosts(_pId) {
    const contract = await getContract(contractAddress, Artifact);
    const { repPosts } = await getRepPosts(_pId, contract);
    setRepPs(repPosts);
  }
  return (
    <ul className="list-inside" style={{ listStyle: "disc" }}>
      {repPs.map((repP, i) => (
        <li key={i}>
          <Link href={`/accounts/${repP.sender}`}>
            <a>{repP.sender.substring(0, 14) + "..."}</a>
          </Link>
          <a href={`/posts/${repP.pId}`}>
            <CommentCard text={repP.text} />
          </a>
          {repSum[repP.pId] > 0 && !openPId.includes(repP.pId) && (
            <p className="text-left pl-2 text-primary">
              <span onClick={() => setOpenPId([...openPId, repP.pId])}>{`▼ ${
                repSum[repP.pId]
              } REPLIES`}</span>
            </p>
          )}
          {repSum[repP.pId] > 0 && openPId.includes(repP.pId) && (
            <p className="text-left pl-2 text-primary">
              <span
                onClick={() =>
                  setOpenPId(openPId.filter((o) => o !== repP.pId))
                }
              >{`▲ CLOSE REPLIES`}</span>
            </p>
          )}
          {openPId.includes(repP.pId) && (
            <div className="ml-4">
              <ReplyPostList
                pId={repP.pId}
                repSum={repSum}
                setOpenPId={setOpenPId}
                openPId={openPId}
              />
            </div>
          )}
          {/* <ReplyPostList  /> */}
        </li>
      ))}
    </ul>
  );
};

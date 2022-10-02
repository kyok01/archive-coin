import { CommentCard } from "components/atoms/CommentCard";
import React, { useEffect, useState } from "react";

import Artifact from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { getContract } from "util/getContract";
import { getRepPosts } from "util/getRepPosts";

export const ReplyPostList = ({ pId, repSum, setOpenPId, openPId }) => {
  const [repPs, setRepPs] = useState([]);
  useEffect(() => {
    getAndSetRepPosts(pId)
  }, []);

  async function getAndSetRepPosts(_pId) {
    const contract = await getContract(contractAddress, Artifact);
    const { repPosts } = await getRepPosts(_pId, contract);
    setRepPs(repPosts)
  }
  return (
    <ul className="list-inside" style={{ listStyle: "disc" }}>
      {repPs.map((repP, i) => (
        <li key={i}>
          {repP.sender.substring(0, 14) + "..."}
          <CommentCard text={repP.text} />
          {repSum[repP.pId] > 0 && !openPId.includes(repP.pId) && (
            <p className="text-left pl-2">
              <span onClick={() => setOpenPId([...openPId, repP.pId])}>{`▼ ${
                repSum[repP.pId]
              } REPLIES`}</span>
            </p>
          )}
          {openPId.includes(repP.pId) && <div className="ml-4"><ReplyPostList pId={repP.pId} repSum={repSum} setOpenPId={setOpenPId} openPId={openPId} /></div>}
          {/* <ReplyPostList  /> */}
        </li>
      ))}
    </ul>
  );
};

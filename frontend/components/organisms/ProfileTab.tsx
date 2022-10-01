import Link from "next/link";
import React from "react";

export const ProfileTab = ({ pId, tab }) => {
  return (
    <div className="tabs">
      <Link href={`/accounts/${pId}`}>
        <a className={`tab tab-bordered ${tab === 1 && "tab-active"} `}>
          Posts
        </a>
      </Link>
      <Link href={`/accounts/${pId}/mintNft`}>
        <a className={`tab tab-bordered ${tab === 2 && "tab-active"}`}>NFT</a>
      </Link>
      <Link href={`/accounts/${pId}/chat`}>
        <a className={`tab tab-bordered ${tab === 3 && "tab-active"}`}>Chat</a>
      </Link>
    </div>
  );
};

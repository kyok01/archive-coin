import { BaseProvider } from "@metamask/providers";
import Link from "next/link";

declare global {
  interface Window {
    ethereum: BaseProvider;
  }
}

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PrimaryBtn } from "../atoms/PrimaryBtn";
import { SecondaryBtn } from "../atoms/SecondaryBtn";

export const Navbar = () => {
  const [connected, toggleConnect] = useState(false);
  const router = useRouter();
  const [currAddress, updateAddress] = useState("0x");

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  async function connectWebsite() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x5") {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    }
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        getAddress();
        window.location.replace(router.pathname);
      });
  }

  useEffect(() => {
    let val = window.ethereum.isConnected();
    if (val) {
      getAddress();
      toggleConnect(val);
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.replace(router.pathname);
    });
  });

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/posts">Posts</Link>
            </li>
            <li tabIndex={0}>
              <a className="justify-between">
                Parent
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </a>
              <ul className="p-2">
                <li>
                  <a>This month</a>
                </li>
                <li>
                  <a>Last month</a>
                </li>
                <li>
                  <a>Others</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Search</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl">Wadatsumi</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link href="/posts">Posts</Link>
          </li>
          <li tabIndex={0}>
            <a>
              Trend
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2 bg-base-100">
              <li>
                <a>This month</a>
              </li>
              <li>
                <a>Last month</a>
              </li>
              <li>
                <a>Others</a>
              </li>
            </ul>
          </li>
          <li>
            <a>Search</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <div className="hidden lg:block">
          <PrimaryBtn>Write</PrimaryBtn>
        </div>
        {connected ? (
          <div className="mx-2">
            <SecondaryBtn onClick={connectWebsite}>
            {currAddress.substring(0, 7) + "..."}
          </SecondaryBtn>
          </div>
          
        ) : (
          <SecondaryBtn onClick={connectWebsite}>Connect Wallet</SecondaryBtn>
        )}
      </div>
    </div>
  );
};

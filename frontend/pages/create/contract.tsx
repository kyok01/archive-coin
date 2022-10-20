/* eslint import/order: 0, import/no-unresolved: 0 */

import { Navbar } from "components/organisms/NavBar";
import { getContract } from "util/getContract";
import ArtifactOfA from "@cont/ArchiveCoin.json";
import contractAddress from "@cont/contract-address.json";
import { ethers } from "ethers";
import { CreateContractForm } from "components/organisms/CreateContractForm";
import { createNftContract } from "util/createContract";
import { useEffect, useState } from "react";
import { H1 } from "components/atoms/H1";
import { getSigner } from "util/getSigner";

export default function CreateContract() {
  const [fee, setFee] = useState<number | string>("");
  const [cAddress, setCAddress] = useState<string>("");
  const [exists, setExists] = useState<boolean>(false);
  useEffect(() => {
    getFee();
    contractExists();
  }, []);

  async function getFee() {
    const contract = await getContract(contractAddress, ArtifactOfA);
    const _fee = await contract.getFee();
    setFee(ethers.utils.formatEther(_fee));
  }

  async function contractExists() {
    const signer = await getSigner();
    const contract = await getContract(contractAddress, ArtifactOfA);
    const createdContract = await contract.getEoaToContract(
      await signer.getAddress()
    );
    createdContract !== "0x0000000000000000000000000000000000000000" &&
      (setExists(true), setCAddress(createdContract));
  }

  async function createAndDisplayCAddress(e) {
    const transaction = await createNftContract(String(fee), e);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider
      .getTransactionReceipt(transaction.hash)
      .then(function (transactionReceipt) {
        setCAddress(transactionReceipt.logs[0].address);
      });
  }

  return (
    <>
      <Navbar />
      <div className="w-full max-w-4xl mx-auto">
        <H1 text="Create Your NFT Contract" />
        <div className="mt-4">
          <p>To create chat, you have to deploy a contract of ERC-721(NFT).</p>
          <p>
            Contract creation fee is{" "}
            <a className="underline decoration-secondary decoration-2">
              {fee} ether
            </a>
            .
          </p>
        </div>
        {cAddress && exists && (
          <div className="space-y-2 my-4">
            <div className="alert alert-warning shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>
                  Warning: You have already created and registered your NFT
                  contract Address.
                </span>
              </div>
            </div>
            <div className="alert alert-info shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current flex-shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  Warning: Your contract address is {cAddress}.<br />
                  If you want to create and register contract address again,
                  please submit the form below.
                </span>
              </div>
            </div>

          </div>
        )}
        <CreateContractForm onSubmit={(e) => createAndDisplayCAddress(e)} />
        {cAddress && !exists && (
          <div className="alert alert-success shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                You have created!! Your contract address is{" "}
                <a className="underline decoration-secondary decoration-2">
                  {cAddress}
                </a>
                .
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

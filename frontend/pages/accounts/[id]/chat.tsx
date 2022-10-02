/* eslint import/order: 0, import/no-unresolved: 0 */
import { GetServerSideProps } from "next";
import ArtifactOfA from "@cont/ArchiveCoin.json";
import ArtifactOfN from "@cont/NftContract.json";
import contractAddress from "@cont/contract-address.json";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { PrimaryBtn } from "components/atoms/PrimaryBtn";
import { Navbar } from "components/organisms/NavBar";
import { WriteCommentForm } from "components/organisms/WriteCommentForm";

import { getContract } from "util/getContract";
import { H1 } from "components/atoms/H1";
import { ProfileTab } from "components/organisms/ProfileTab";
import Image from "next/image";
import { ChatRoomTitle } from "components/organisms/ChatRoomTitle";
import { Message } from "components/atoms/Message";
import { getSigner } from "util/getSigner";
import { ChatInputForm } from "components/organisms/ChatInputForm";

export default function ChatPage({ pId }) {
  const [nftContAdd, setNftContAdd] = useState("");
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getNftContractAddress(pId);
    nftContAdd && (getAllChats(nftContAdd), listenEvent());
  }, [nftContAdd]);

  useEffect(()=>{
    autoScroll();
  },[messages])

  async function getNftContractAddress(pId) {
    // TODO: have to make util function that returns signer
    try {
      const contract = await getContract(contractAddress, ArtifactOfA);
      const transaction = await contract.getEoaToContract(pId);
      console.log(transaction);
      transaction != "0x0000000000000000000000000000000000000000" &&
        setNftContAdd(transaction);
    } catch (e) {
      alert("Upload error" + e);
    }
  }

  function autoScroll() {
    scrollBottomRef?.current?.scrollIntoView();
  }

  async function sendMessage(nftContAdd, event) {
    event.preventDefault();

    try {
      const contract = await getContract(
        {
          address: nftContAdd,
        },
        ArtifactOfN
      );

      const transaction = await contract.sendValidatedMessage(draftMessage);
      await transaction.wait();

      alert("Successfully send your Message!");
    } catch (e) {
      alert("Upload error" + e);
    }
  }

  async function getAllChats(nftContAdd) {
    const contract = await getContract(
      {
        address: nftContAdd,
      },
      ArtifactOfN
    );
    const _messages = await contract.getAllMessages();
    const signer = await getSigner();
    const addr = await signer.getAddress();

    const _messagesWithBoolean = await Promise.all(
      _messages.map(async (m, i) => {
        const isMessageOfAccount = m.from == addr;
        const item = {
          from: m.from,
          message: m.message,
          timestamp: m.timestamp,
          isMessageOfAccount,
        };
        return item;
      })
    );
    setMessages(_messagesWithBoolean);
  }

  async function listenEvent() {
    const contract = await getContract(
      {
        address: nftContAdd,
      },
      ArtifactOfN
    );
    const filter = contract.filters.sendMessageEvent(null, null, null);
    contract.on(filter, (_id, _from, _message) => {
      console.log(`by ${_from}, ${_message}`);
      getAllChats(nftContAdd);
    });
  }
  return (
    <>
      <Navbar />
      <div className="w-5/6 m-auto flex justify-center">
        <H1 text={pId} />
      </div>
      <div className="flex justify-center">
        <ProfileTab pId={pId} tab={3} />
      </div>
      <div className="container mx-auto w-5/6 lg:w-3/5">
        <ChatRoomTitle title="Dock Hack Token" />

        <div className="min-w-full lg:grid lg:grid-cols-2">
          <div className="lg:col-span-2 lg:block">
            <div className="w-full">
              <div
                className="relative w-full p-6 overflow-y-auto h-50v lg:h-60v"
                id="target"
              >
                <ul className="space-y-2">
                  {messages.map((m, i) => (
                    <Message
                      isMessageOfAccount={m.isMessageOfAccount}
                      text={m.message}
                      from={m.from}
                      key={i}
                    />
                  ))}
                </ul>
                <div ref={scrollBottomRef}/>
              </div>

              <ChatInputForm onClick={(e) => sendMessage(nftContAdd, e)} onChange={(e) => setDraftMessage(e.target.value)} draftMessage={draftMessage}/>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return { props: { pId: id } };
};

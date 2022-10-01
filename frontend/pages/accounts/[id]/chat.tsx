/* eslint import/order: 0, import/no-unresolved: 0 */
import { GetServerSideProps } from "next";
import ArtifactOfA from "@cont/ArchiveCoin.json";
import ArtifactOfN from "@cont/NftContract.json";
import contractAddress from "@cont/contract-address.json";
import { useEffect, useState } from "react";

import { PrimaryBtn } from "components/atoms/PrimaryBtn";
import { Navbar } from "components/organisms/NavBar";
import { WriteCommentForm } from "components/organisms/WriteCommentForm";

import { getContract } from "util/getContract";
import { H1 } from "components/atoms/H1";
import { ProfileTab } from "components/organisms/ProfileTab";

export default function ChatPage({ pId }) {
  const [nftContAdd, setNftContAdd] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getNftContractAddress(pId);
    nftContAdd && (getAllChats(nftContAdd), listenEvent());
  }, [nftContAdd]);
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
  async function mintNft() {
    const contract = await getContract(
      {
        address: nftContAdd,
      },
      ArtifactOfN
    );
    const price = await contract.getPrice();
    const transaction = await contract.safeMint(
      "https://gateway.pinata.cloud/ipfs/Qmaf2uy3q2orbSmNmUjwmniUh86zUKT3u6JjbmdZapqUMZ",
      { value: price }
    );
    await transaction.wait();
    alert("successfully mint");
  }

  async function chat(nftContAdd, event) {
    event.preventDefault();

    try {
      const contract = await getContract(
        {
          address: nftContAdd,
        },
        ArtifactOfN
      );

      const text = event.target.text.value;

      const transaction = await contract.sendValidatedMessage(text);
      await transaction.wait();

      alert("Successfully send your Comment!");
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
    console.log(_messages);

    setMessages(_messages);
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
        <div className="min-w-full lg:grid lg:grid-cols-2">
          {/* <div className="border-r border-gray-300 lg:col-span-1">
            {/* <div className="mx-3 my-3">
              <div className="relative text-gray-600">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-gray-300"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </span>
                <input
                  type="search"
                  className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
                  name="search"
                  placeholder="Search"
                  required
                />
              </div>
            </div>

             <ul className="overflow-auto h-[32rem]">
              <h2 className="my-2 mb-2 ml-2 text-lg text-gray-600">Chats</h2>
              <li>
                <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
                  <img
                    className="object-cover w-10 h-10 rounded-full"
                    src="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg"
                    alt="username"
                  />
                  <div className="w-full pb-2">
                    <div className="flex justify-between">
                      <span className="block ml-2 font-semibold text-gray-600">
                        Jhon Don
                      </span>
                      <span className="block ml-2 text-sm text-gray-600">
                        25 minutes
                      </span>
                    </div>
                    <span className="block ml-2 text-sm text-gray-600">
                      bye
                    </span>
                  </div>
                </a>
                <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out bg-gray-100 border-b border-gray-300 cursor-pointer focus:outline-none">
                  <img
                    className="object-cover w-10 h-10 rounded-full"
                    src="https://cdn.pixabay.com/photo/2016/06/15/15/25/loudspeaker-1459128__340.png"
                    alt="username"
                  />
                  <div className="w-full pb-2">
                    <div className="flex justify-between">
                      <span className="block ml-2 font-semibold text-gray-600">
                        Same
                      </span>
                      <span className="block ml-2 text-sm text-gray-600">
                        50 minutes
                      </span>
                    </div>
                    <span className="block ml-2 text-sm text-gray-600">
                      Good night
                    </span>
                  </div>
                </a>
                <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
                  <img
                    className="object-cover w-10 h-10 rounded-full"
                    src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg"
                    alt="username"
                  />
                  <div className="w-full pb-2">
                    <div className="flex justify-between">
                      <span className="block ml-2 font-semibold text-gray-600">
                        Emma
                      </span>
                      <span className="block ml-2 text-sm text-gray-600">
                        6 hour
                      </span>
                    </div>
                    <span className="block ml-2 text-sm text-gray-600">
                      Good Morning
                    </span>
                  </div>
                </a>
              </li>
            </ul> 
          </div> */}
          <div className="lg:col-span-2 lg:block">
            <div className="w-full">
              <div className="relative flex items-center p-3 border-b border-gray-300">
                <img
                  className="object-cover w-10 h-10 rounded-full"
                  src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg"
                  alt="username"
                />
                <span className="block ml-2 font-bold text-gray-600">Emma</span>
                <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
              </div>
              <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
                <ul className="space-y-2">
                  <li className="flex justify-start">
                    <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                      <span className="block">Hi</span>
                    </div>
                  </li>
                  <li className="flex justify-end">
                    <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                      <span className="block">Hiiii</span>
                    </div>
                  </li>
                  <li className="flex justify-end">
                    <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                      <span className="block">how are you?</span>
                    </div>
                  </li>
                  <li className="flex justify-start">
                    <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                      <span className="block">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>

                <input
                  type="text"
                  placeholder="Message"
                  className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                  name="message"
                  required
                />
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
                <button type="submit">
                  <svg
                    className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col my-2">
        {messages.map((m, i) => (
          <div key={i}>
            {m.message} by {m.from}
          </div>
        ))}
      </div>
      <WriteCommentForm onSubmit={(e) => chat(nftContAdd, e)} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return { props: { pId: id } };
};

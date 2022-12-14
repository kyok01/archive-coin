// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {MyToken} from "./NftContract.sol";
import {IDockHackDiary} from "./interfaces/IDockHackDiary.sol";
import {IPartOfERC721} from "./interfaces/IPartOfERC721.sol";

contract DockHackDiary is Ownable, IDockHackDiary {
    using Counters for Counters.Counter;
    Counters.Counter private _pIdCounter;
    uint256 private _fee;

    mapping(uint256 => Post) pIdToPost;
    mapping(address => address) eoaToContract;

    Counters.Counter private _messageIdCounter;
    mapping(uint256 => Message) private messagesList;

    constructor() {
        _fee = 0.0001 ether;
    }

    /**
     * @dev functions about post
     */
    function setPost(
        string memory title,
        string memory text,
        uint256 replyTo
    ) public {
        _pIdCounter.increment();
        uint256 pId = _pIdCounter.current();

        Post memory _post = Post(
            msg.sender,
            title,
            text,
            replyTo,
            block.timestamp
        );
        pIdToPost[pId] = _post;
    }

    function getPostForPId(uint256 pId) public view returns (Post memory) {
        return pIdToPost[pId];
    }

    function getAllPosts() public view returns (Post[] memory) {
        uint256 totalPostCount = _pIdCounter.current();
        uint256 currentIndex = 0;

        Post[] memory posts = new Post[](totalPostCount);
        for (uint256 i = 0; i < totalPostCount; i++) {
            posts[currentIndex] = pIdToPost[i + 1];
            currentIndex += 1;
        }
        return posts;
    }

    /**
     * @dev create NFT Contract
     */
    function createNftContract(
        uint256 mintPrice,
        uint256 maxSupply,
        string memory uri
    ) public payable {
        require(msg.value == _fee, "msg value is incorrect");
        MyToken mytoken = new MyToken(mintPrice, maxSupply, msg.sender, uri);
        address myTokenAddress = address(mytoken);
        setEoaToContract(myTokenAddress);
    }

    /**
     * @dev functions about eoaToContract
     */
    function getEoaToContract(address e) public view returns (address) {
        return eoaToContract[e];
    }

    function setEoaToContract(address c) public {
        eoaToContract[msg.sender] = c;
    }

    /**
     * @dev functions about message
     */
    function sendValidatedMessage(string memory message, address chatRoomOwner)
        public
    {
        address contractAddress = getEoaToContract(chatRoomOwner);
        require(contractAddress != address(0), "have not set eoaToContract");

        IPartOfERC721 callee = IPartOfERC721(contractAddress);
        if (msg.sender != chatRoomOwner) {
            require(callee.balanceOf(msg.sender) >= 1, "You do not have token");
        }
        _sendMessage(message, chatRoomOwner);
    }

    function _sendMessage(string memory message, address chatRoomOwner)
        internal
    {
        _messageIdCounter.increment();
        uint256 mId = _messageIdCounter.current();
        messagesList[mId] = Message(
            msg.sender,
            message,
            block.timestamp,
            chatRoomOwner
        );
        emit sendMessageEvent(mId, msg.sender, message, chatRoomOwner);
    }

    function getMessageForId(uint256 id) public view returns (Message memory) {
        return messagesList[id];
    }

    function getAllMessagesForChatRoom(address chatRoomOwner)
        public
        view
        returns (Message[] memory)
    {
        // if the chat is empty
        uint256 currentIndex = 0;
        uint256 totalIndex = _messageIdCounter.current();
        uint256 sizeOfArr = 0;

        // loads all the message ids on 'ids' list.
        for (uint i = 1; i <= totalIndex; i++) {
            // if the sender is different than me.
            if (messagesList[i].chatRoomOwner == chatRoomOwner) {
                sizeOfArr += 1;
            }
        }

        // give me the ids.
        Message[] memory messages = new Message[](sizeOfArr);

        for (uint i = 1; i <= totalIndex; i++) {
            // if the sender is different than me.
            if (messagesList[i].chatRoomOwner == chatRoomOwner) {
                messages[currentIndex] = messagesList[i];
                currentIndex += 1;
            }
        }

        return messages;
    }

    function getAllMessages() public view returns (Message[] memory) {
        // if the chat is empty
        uint256 currentIndex = 0;
        uint256 totalIndex = _messageIdCounter.current();
        if (_messageIdCounter.current() == 0) {
            return new Message[](0);
        }

        // give me the ids.
        Message[] memory messages = new Message[](totalIndex);

        // loads all the message ids on 'ids' list.
        for (uint i = 1; i <= totalIndex; i++) {
            // if the sender is different than me.
            messages[currentIndex] = messagesList[i];
            currentIndex += 1;
        }
        return messages;
    }

    /**
     * @dev functions about fee
     */
    function getFee() public view returns (uint256) {
        return _fee;
    }

    function setFee(uint256 newFee) public onlyOwner {
        _fee = newFee;
    }

    /**
     * @dev functions about withdrawing
     */
    fallback() external payable {}

    receive() external payable {}

    function withdraw(uint256 amount, address recipient) public onlyOwner {
        require(
            amount <= address(this).balance,
            "Your requesting amount is over treasury."
        );
        payable(recipient).transfer(amount);
        emit HasWithdrawn(amount, recipient, address(this).balance);
    }
}

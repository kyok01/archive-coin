// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    uint256 private mintPrice;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _messageIdCounter;

    struct Message {
        address from;
        string message;
        uint timestamp;
    }

    mapping(uint256 => Message) private messagesList;

    event sendMessageEvent(
        uint indexed _id,
        address indexed _from,
        string _message
    );

    constructor(uint256 _price) ERC721("MyToken", "MTK") {
        mintPrice = _price;
    }

    function safeMint(string memory uri) payable public {
        require(msg.value == mintPrice, "Your msg value is incorrect");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // fuction about chat
    function sendValidatedMessage(string memory message) public {
        if (msg.sender != owner()) {
            require(balanceOf(msg.sender) >= 1, "You do not have nft");
            _sendMessage(message);
        }
    }

    function _sendMessage(string memory message) internal {
        _messageIdCounter.increment();
        uint256 mId = _messageIdCounter.current();
        messagesList[mId] = Message(msg.sender, message, block.timestamp);
        emit sendMessageEvent(mId, msg.sender, message);
    }

    function getMessageForId(uint256 id) public view returns (Message memory) {
        return messagesList[id];
    }

    function getAllMessages() public view returns (Message[] memory) {
        // if the chat is empty
        if (_messageIdCounter.current() == 0) {
            return new Message[](0);
        }

        // give me the ids.
        Message[] memory messages = new Message[](_messageIdCounter.current());

        // loads all the message ids on 'ids' list.
        for (uint i = 1; i <= _messageIdCounter.current(); i++) {
            // if the sender is different than me.
            messages[i] = messagesList[i];
        }
        return messages;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}

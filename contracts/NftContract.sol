// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {IMyToken} from "./interfaces/IMyToken.sol";

contract MyToken is ERC721, ERC721URIStorage, Ownable, IMyToken {
    using Counters for Counters.Counter;
    uint256 private mintPrice;
    string private uri;
    uint256 private maxSupply;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _messageIdCounter;

    mapping(uint256 => Message) private messagesList;

    address creator;

    constructor(
        uint256 _price,
        uint256 _maxSupply,
        address _creator,
        string memory _uri
    ) ERC721("MyToken", "MTK") {
        mintPrice = _price;
        maxSupply = _maxSupply;
        creator = _creator; // not owner. owner = DockHackDiary contract
        uri = _uri;
    }

    /**
     * @dev functions about mint
     */
    function safeMint() public payable {
        require(msg.value == mintPrice, "Your msg value is incorrect");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        require(
            tokenId <= maxSupply,
            "The number of minted NFT has reached max supply"
        );

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev functions about message
     */
    function sendValidatedMessage(string memory message) public {
        if (msg.sender != creator) {
            require(balanceOf(msg.sender) >= 1, "You do not have nft");
        }
        _sendMessage(message);
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
     * @dev functions about price
     */
    function getPrice() public view returns (uint256) {
        return mintPrice;
    }

    function setPrice(uint256 _price) public {
        require(
            msg.sender == creator,
            "you are not the creator of this contract"
        );
        mintPrice = _price;
    }

    /**
     * @dev functions about maxSupply
     */
    function getMaxSupply() public view returns (uint256) {
        return maxSupply;
    }

    function setMaxSupply(uint256 _maxSupply) public {
        require(
            msg.sender == creator,
            "you are not the creator of this contract"
        );
        maxSupply = _maxSupply;
    }

    /**
     * @dev functions about creator
     */
    function getCreator() public view returns (address) {
        return creator;
    }

    function setCreator(address _creator) public {
        require(
            msg.sender == creator,
            "you are not the creator of this contract"
        );
        creator = _creator;
    }

    /**
     * @dev functions about counter
     */
    function getCurrentTokenId() external view returns(uint256){
        return _tokenIdCounter.current();
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

    /**
     * @dev The following functions are overrides required by Solidity.
     */
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

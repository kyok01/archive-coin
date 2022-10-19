// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {MyToken} from "./NftContract.sol";
import {IDockHackDiary} from "./interface/IDockHackDiary.sol";

contract DockHackDiary is Ownable, IDockHackDiary {
    using Counters for Counters.Counter;
    Counters.Counter private _pIdCounter;
    uint256 private _fee;

    mapping(uint256 => Post) pIdToPost;
    mapping(address => address) eoaToContract;

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
    function createNftContract(uint256 mintPrice, uint256 maxSupply, string memory uri)
        public
        payable
    {
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

    /**
     * @dev functions about withdrawing
     */
    function setEoaToContract(address c) public {
        eoaToContract[msg.sender] = c;
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
        require(amount <= address(this).balance, "Your requesting amount is over treasury.");
        payable(recipient).transfer(amount);
        emit HasWithdrawn(amount, recipient, address(this).balance);
    }
}

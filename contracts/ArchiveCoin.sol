// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {MyToken} from "./NftContract.sol";

contract DockHackDiary is
    Ownable
{
    using Counters for Counters.Counter;
    Counters.Counter private _pIdCounter;
    Counters.Counter private _cIdCounter;
    uint256 private _randomRange;
    uint256 private _reward;
    uint256 private _fee;

    /**
     * TODO: write private function about the number of mint within one hour. 
     */
    uint256 private limitPerH; 

    struct Post {
        address sender;
        string title;
        string text;
        uint256 replyTo;
        uint timestamp;
    }

    struct Comment {
        address sender;
        string text;
        uint256 replyTo;
        uint timestamp;
    }

    mapping(uint256 => Post) pIdToPost;
    mapping(uint256 => Comment) cIdToComment;
    mapping(address => address) eoaToContract;

    constructor() {
        _fee = 0.0001 ether;
    }

    // functions about post

    function setPost(
        string memory title,
        string memory text,
        uint256 replyTo
    ) public {
        _pIdCounter.increment();
        uint256 pId = _pIdCounter.current();

        Post memory _post = Post(msg.sender, title, text, replyTo, block.timestamp);
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
            posts[currentIndex] = pIdToPost[i+1];
            currentIndex += 1;
        }
        return posts;
    }

    function setComment(
        string memory text,
        uint256 replyTo
    ) public {
        uint256 cId = _cIdCounter.current();
        _cIdCounter.increment();

        Comment memory _comment = Comment(msg.sender, text, replyTo, block.timestamp);
        cIdToComment[cId] = _comment;
    }

    function getCommentForCId(uint256 cId)
        public
        view
        returns (Comment memory)
    {
        return cIdToComment[cId];
    }

    function getAllComments() public view returns (Comment[] memory) {
        uint256 totalCommentCount = _cIdCounter.current();
        uint256 currentIndex = 0;

        Comment[] memory comments = new Comment[](totalCommentCount);
        for (uint256 i = 0; i < totalCommentCount; i++) {
            comments[currentIndex] = cIdToComment[i+1];
            currentIndex += 1;
        }
        return comments;
    }

    // create NFT Contract
    function createNftContract(uint256 mintPrice) public payable returns (MyToken){
        require(msg.value == _fee, "msg value is incorrect");
        return new MyToken(mintPrice, msg.sender);
    }

    // functions about eoaToContract
    function getEoaToContract(address e) public view returns(address){
        return eoaToContract[e];
    }

    // TODO: msg.sender must be address c creator
    function setEoaToContract(address c) public {
        eoaToContract[msg.sender] = c;
    }

    // functions about fee
    function getFee() public view returns(uint256){
        return _fee;
    }

    function setFee(uint256 newFee) public onlyOwner {
        _fee = newFee;
    }
}

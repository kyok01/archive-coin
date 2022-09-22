// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArchiveCoin is
    ERC20,
    ERC20Burnable,
    ERC20Snapshot,
    Ownable,
    ERC20Permit,
    ERC20Votes
{
    using Counters for Counters.Counter;
    Counters.Counter private _pIdCounter;
    Counters.Counter private _cIdCounter;
    uint256 private randomRange;
    uint256 private reward;
    
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

    constructor() ERC20("Archive Coin", "ARCV ") ERC20Permit("Archive Coin") {
        randomRange = 2;
        reward = 1;
        limitPerH = 30;
    }

    // functions about Token

    function snapshot() public onlyOwner {
        _snapshot();
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
        randomMint(msg.sender);
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

    // function about randomness
    function randomMint(address to) private {
        if (random() == 1) {
            _mint(to, reward);
        }
    }

    function setRange(uint256 num) public onlyOwner {
        randomRange = num;
    }

    function getRange() public view returns (uint256) {
        return randomRange;
    }

    // internal function
    function random() private view returns (uint) {
        // sha3 and now have been deprecated
        return
            uint(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        _pIdCounter.current(),
                        _cIdCounter.current()
                    )
                )
            ) % randomRange;
        // convert hash to integer
        // players is an array of entrants
    }

    // function about amount
    function setAmount(uint256 num) public onlyOwner {
        reward = num;
    }

    function getAmount() public view returns (uint256) {
        return reward;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Snapshot) {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}

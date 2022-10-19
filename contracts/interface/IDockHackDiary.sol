// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IDockHackDiary {

    struct Post {
        address sender;
        string title;
        string text;
        uint256 replyTo;
        uint timestamp;
    }

    event HasWithdrawn(uint256 amount, address recipient, uint256 balance);

    function setPost(
        string memory title,
        string memory text,
        uint256 replyTo
    ) external;

    function getPostForPId(uint256 pId) external view returns (Post memory);

    function getAllPosts() external view returns (Post[] memory);

    /**
     * @dev create NFT Contract
     */
    function createNftContract(uint256 mintPrice, uint256 maxSupply, string memory uri)
        external
        payable;

    /**
     * @dev functions about eoaToContract
     */
    function getEoaToContract(address e) external view returns (address);

    /**
     * @dev functions about withdrawing
     */
    function setEoaToContract(address c) external;

    /**
     * @dev functions about fee
     */
    function getFee() external view returns (uint256);

    function setFee(uint256 newFee) external;

    /**
     * @dev functions about withdrawing
     */

    function withdraw(uint256 amount, address recipient) external;
}
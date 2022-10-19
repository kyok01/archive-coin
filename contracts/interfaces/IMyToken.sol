// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IMyToken {
    struct Message {
        address from;
        string message;
        uint timestamp;
    }

    event sendMessageEvent(
        uint indexed _id,
        address indexed _from,
        string _message
    );

    event HasWithdrawn(uint256 amount, address recipient, uint256 balance);

    /**
     * @dev functions about mint
     */
    function safeMint() external payable;

    /**
     * @dev functions about message
     */
    function sendValidatedMessage(string memory message) external;

    function getMessageForId(uint256 id) external view returns (Message memory);

    function getAllMessages() external view returns (Message[] memory);

    /**
     * @dev functions about price
     */
    function getPrice() external view returns (uint256);

    function setPrice(uint256 _price) external;

    /**
     * @dev functions about maxSupply
     */
    function getMaxSupply() external view returns (uint256);

    function setMaxSupply(uint256 _maxSupply) external;

    /**
     * @dev functions about creator
     */
    function getCreator() external view returns (address);

    function setCreator(address _creator) external;

    /**
     * @dev functions about withdrawing
     */

    function withdraw(uint256 amount, address recipient) external;
}

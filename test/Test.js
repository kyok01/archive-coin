const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Archive Coin", function () {
  async function deployTokenFixture() {
    const ARCV = await ethers.getContractFactory("ArchiveCoin");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Contract = await ARCV.deploy();

    await Contract.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Contract, owner, addr1, addr2 };
  }
  it("Posts", async function () {
    const { Contract, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    let addr1Balance = await ethers.provider.getBalance(addr1.address);
    console.dir("addr1=" + addr1Balance);

    await Contract.setPost("title", "text", 0);
    let ownerBalance = await Contract.balanceOf(owner.address);
    console.dir("owner=" + ownerBalance);

    await Contract.connect(addr1).setPost("title:re", "text:re", 1);
    // let ownerBalance = await ethers.provider.getBalance(owner.address);
    addr1Balance = await Contract.balanceOf(addr1.address);
    console.dir("addr1=" + addr1Balance);

    let allPost = await Contract.getAllPosts();
    // console.log(allPost[0]);

    expect(allPost[1]).to.deep.equal(await Contract.getPostForPId(2));
  });

  it("Comments", async function () {
    const { Contract, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    let addr1Balance = await ethers.provider.getBalance(addr1.address);
    console.dir("addr1=" + addr1Balance);

    await Contract.setPost("title", "text", 0);
    let ownerBalance = await Contract.balanceOf(owner.address);
    console.dir("owner=" + ownerBalance);

    await Contract.connect(addr1).setComment("text:re", 1);
    addr1Balance = await Contract.balanceOf(addr1.address);
    console.dir("addr1=" + addr1Balance);

    let allComments = await Contract.getAllComments();
    // console.log(allPost[0]);

    expect(allComments[0]).to.deep.equal(await Contract.getCommentForCId(1));
  });

  it("createNftContract", async function () {
    const { Contract, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    const token = await Contract.createNftContract();
    console.log(token);
    console.log(token.hash);
    console.log(token.getAbi());

    ethers.provider.getTransactionReceipt(token.hash).then(function(transactionReceipt) {
      console.log(transactionReceipt);
  });

  });
});

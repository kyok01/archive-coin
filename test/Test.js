const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Archive Coin", function () {
  async function deployTokenFixture() {
    // ArchiveCoin Contract
    const ARCV = await ethers.getContractFactory("ArchiveCoin");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Contract = await ARCV.deploy();

    await Contract.deployed();

    // Nft Contract
    const NC = await ethers.getContractFactory("MyToken");
    const Contract2 = await NC.deploy(ethers.utils.parseEther("0.0001"));

    await Contract2.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Contract, Contract2, owner, addr1, addr2 };
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

  it("CreateNftContract", async function () {
    const { Contract, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    const token = await Contract.createNftContract(
      ethers.utils.parseEther("0.0001"),
      { value: ethers.utils.parseEther("0.0001") }
    );
    const result = await ethers.provider
      .getTransactionReceipt(token.hash)
      .then(function (transactionReceipt) {
        logs(transactionReceipt);
      });

    function logs(transactionReceipt) {
      console.log("//");
      console.log(transactionReceipt);
      console.log("////");
      console.log(transactionReceipt.to);
      console.log("//////");
      console.log(transactionReceipt.logs[0]);
      console.log("////////");
      console.log(transactionReceipt.logs[0].address);
    }
    Contract.setFee(ethers.utils.parseEther("0.00001"));
    await expect(
      Contract.createNftContract(ethers.utils.parseEther("0.0001"), {
        value: ethers.utils.parseEther("0.0001"),
      })
    ).to.be.revertedWith("msg value is incorrect");
  });

  it("NftContract", async function () {
    const { Contract2, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    await Contract2.safeMint("aaa", {
      value: ethers.utils.parseEther("0.0001"),
    });
    await Contract2.connect(addr1).safeMint("aaa", {
      value: ethers.utils.parseEther("0.0001"),
    });
    await expect(
      Contract2.connect(addr2).sendValidatedMessage("aaa")
    ).to.be.revertedWith("You do not have nft");

    await expect(Contract2.ownerOf(1) == owner.address);
    await expect(Contract2.ownerOf(2) == addr2.address);
  });
});

const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Archive Coin", function () {
  async function deployTokenFixture() {
    // ArchiveCoin Contract
    const ARCV = await ethers.getContractFactory("DockHackDiary");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Contract = await ARCV.deploy();

    await Contract.deployed();

    // Nft Contract
    const NC = await ethers.getContractFactory("MyToken");
    const Contract2 = await NC.deploy(
      ethers.utils.parseEther("0.0001"),
      2,
      owner.address,
      "https://example.com"
    );

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

    await Contract.connect(addr1).setPost("title:re", "text:re", 1);

    let allPost = await Contract.getAllPosts();

    expect(allPost[1]).to.deep.equal(await Contract.getPostForPId(2));
  });

  it("CreateNftContract", async function () {
    const { Contract, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    let nftAddress;

    const token = await Contract.createNftContract(
      ethers.utils.parseEther("0.0001"),
      10,
      "https://tokenUriExample.com",
      { value: ethers.utils.parseEther("0.0001") }
    );
    const result = await ethers.provider
      .getTransactionReceipt(token.hash)
      .then(function (transactionReceipt) {
        logs(transactionReceipt);
      });

    const transactionResult = await token.wait();
    console.log(transactionResult);

    function logs(transactionReceipt) {
      console.log(
        "Created contract address is " + transactionReceipt.logs[0].address
      );
      nftAddress = transactionReceipt.logs[0].address;
    }

    expect(await Contract.getEoaToContract(owner.address)).to.be.equal(
      nftAddress
    );

    Contract.setFee(ethers.utils.parseEther("0.00001"));
    await expect(
      Contract.createNftContract(
        ethers.utils.parseEther("0.0001"),
        10,
        "https://tokenUriExample.com",
        {
          value: ethers.utils.parseEther("0.0001"),
        }
      )
    ).to.be.revertedWith("msg value is incorrect");

    await expect(
      Contract.withdraw(ethers.utils.parseEther("0.00006"), owner.address)
    )
      .to.emit(Contract, "HasWithdrawn")
      .withArgs(
        ethers.utils.parseEther("0.00006"),
        owner.address,
        ethers.utils.parseEther("0.00004")
      );
  });

  it("NftContract", async function () {
    const { Contract, Contract2, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    await Contract2.sendValidatedMessage("aaa");
    await Contract2.connect(owner).sendValidatedMessage("aaa");
    await Contract2.connect(addr1).safeMint({
      value: ethers.utils.parseEther("0.0001"),
    });
    await Contract2.connect(addr1).sendValidatedMessage("aaa");
    await expect(
      Contract2.connect(addr2).sendValidatedMessage("aaa")
    ).to.be.revertedWith("You do not have nft");

    await expect(Contract2.ownerOf(1) == owner.address);
    await expect(Contract2.ownerOf(2) == addr2.address);
    // console.log(await Contract2.getAllMessages());
  });

  it("Mint a lot", async function () {
    const { Contract, Contract2, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    await Contract2.connect(addr1).safeMint({
      value: ethers.utils.parseEther("0.0001"),
    });
    await Contract2.connect(addr1).safeMint({
      value: ethers.utils.parseEther("0.0001"),
    });

    await expect(
      Contract2.connect(addr1).safeMint({
        value: ethers.utils.parseEther("0.0001"),
      })
    ).to.be.revertedWith("The number of minted NFT has reached max supply");

    await expect(
      Contract2.connect(addr1).safeMint({
        value: ethers.utils.parseEther("0.0001"),
      })
    ).to.be.revertedWith("The number of minted NFT has reached max supply");
    
    console.log(await Contract2.getCurrentTokenId());
  });

  it("map eoaToContract", async function () {
    const { Contract, Contract2, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    await Contract.setEoaToContract(Contract2.address);
    console.log(await Contract.getEoaToContract(owner.address));
    expect(Contract2.address).to.equal(
      await Contract.getEoaToContract(owner.address)
    );
  });

  it("creator", async function () {
    const { Contract2, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );
    // setCretor
    await Contract2.setCreator(addr1.address);
    await Contract2.connect(addr1).setCreator(addr2.address);
    await expect(
      Contract2.connect(owner).sendValidatedMessage("aaa")
    ).to.be.revertedWith("You do not have nft");

    // setPrice
    await Contract2.connect(addr2).setPrice(ethers.utils.parseEther("0.0001"));
    await expect(
      Contract2.setPrice(ethers.utils.parseEther("0.1"))
    ).to.be.revertedWith("you are not the creator of this contract");
    console.log(await Contract2.getPrice());
  });
});

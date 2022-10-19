// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const path = require("path");


async function main() {
  const ContractFactory = await ethers.getContractFactory("DockHackDiary");

  // Start deployment, returning a promise that resolves to a contract object
  const Contract = await ContractFactory.deploy();   
  console.log("Contract deployed to address:", Contract.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(Contract);
}

function saveFrontendFiles(contract) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const Artifact = artifacts.readArtifactSync("DockHackDiary");

  fs.writeFileSync(
    path.join(contractsDir, "ArchiveCoin.json"),
    JSON.stringify(Artifact, null, 2)
  );
}


main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });

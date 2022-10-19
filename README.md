# DockHack Diary
DockHack Diary is **"Anonymous Blog Service On A Blockchain"**.
DockHack Diary enables you to tell whatever you want to tell.
Your posts are recorded on a blockchain,so they cannot be tampered with.
Also, you can discuss and chat with others.

## Run locally
```shell
npx hardhat node
```

## Usage
### Install requirements with npm:
```shell
npm install
```
### Run all tests:
```shell
npx hardhat compile
npx hardhat test
```
### Deploy:
Create a .env file with the environment variables. You can use the .env.example file as a reference.

Preparation:
 - Set `API_URL` and `API_KEY` in `.env`
 - Set `PRIVATE_KEY` in `.env`
 - Set `ETHERSCAN_API_KEY` in `.env`


```shell
npx hardhat run scripts/deploy.js --network <network>
```

>⚠️ To deploy smart contract to any EVM based network, You have to rewrite `hardhat.config.js`. If you want to deploy to an EVM network which Alchemy does not have RPC endpoints of, you have to rewrite `.env`.

### Verify contract:
This command will use the deployment artifacts to compile the contracts and compare them to the onchain code
```shell
yarn hardhat --network <network> local-verify
```
This command will upload the contract source to Etherescan
```shell
npx hardhat verify --network <network> <contract address>
```

### Frontend local development setup:
Change directory:
```shell
cd frontend/
```
Install the dependencies:
```shell
yarn
```
Run the development server:
```shell
yarn dev
```
Open http://localhost:3000 with your browser to see the app.

## Commands

```shell
npx hardhat help
npx hardhat node
npx hardhat run scripts/deploy.js
```
## License
All smart contracts are released under MIT
require('dotenv').config();
require("colors")
const fs = require("fs")
/* ; */

/* ; */
/* const { ethers } = require("hardhat"); */
/* const SFCAbi = require("../artifacts/contracts/sfc/SFC.sol/SFC.json").abi; */
/* const StakerInfoAbi = require("../artifacts/contracts/sfc/StakerInfo.sol/StakerInfo.json").abi; */

async function main() {
	// get network
	var [deployer] = await ethers.getSigners();

	/* let network = await deployer.provider._networkPromise;
	let chainId = network.chainId; */

	console.log("deployer", deployer.address);

	let sBTC;
	let stakeTokenizer;
	let stakerInfo;

	/* ----------- sBTC -------------- */
	//deploy SBTC contract for test
	const SBTC = await ethers.getContractFactory("SBTC");
	sBTC = await SBTC.deploy();
	await sBTC.deployed();

	const StakeTokenizer = await ethers.getContractFactory("StakeTokenizer");
	stakeTokenizer = await StakeTokenizer.deploy(sBTC.address);
	await stakeTokenizer.deployed();

	let tx = await sBTC.addMinter(stakeTokenizer.address);
	await tx.wait();

	// stakerInfo
	const StakerInfo = await ethers.getContractFactory("StakerInfo");
	stakerInfo = await StakerInfo.deploy(true);
	await stakerInfo.deployed();

	//sfc
	// const sFC = new ethers.Contract("0xeAb1000000000000000000000000000000000000",SFCAbi,sfcOwner);
	// tx = await sFC.updateStakeTokenizerAddress(stakeTokenizer.address);
	// await tx.wait();

	console.log("SBTC : ", sBTC.address);
	console.log("StakeTokenizer : ", stakeTokenizer.address);
	console.log("StakerInfo : ", stakerInfo.address);

	fs.writeFileSync(__dirname + '/contracts.json', JSON.stringify({
		SBTC: sBTC.address,
		StakeTokenizer: stakeTokenizer.address,
		StakerInfo: stakerInfo.address
	}))
}

main().then(() => console.log("complete".green)).catch((error) => {console.error(error);process.exit(1);});

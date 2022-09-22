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

	let sGLXY;
	let stakeTokenizer;
	let stakerInfo;

	/* ----------- sGLXY -------------- */
	//deploy SGLXY contract for test
	const SGLXY = await ethers.getContractFactory("SGLXY");
	sGLXY = await SGLXY.deploy();
	await sGLXY.deployed();

	const StakeTokenizer = await ethers.getContractFactory("StakeTokenizer");
	stakeTokenizer = await StakeTokenizer.deploy(sGLXY.address);
	await stakeTokenizer.deployed();

	let tx = await sGLXY.addMinter(stakeTokenizer.address);
	await tx.wait();

	// stakerInfo
	const StakerInfo = await ethers.getContractFactory("StakerInfo");
	stakerInfo = await StakerInfo.deploy(true);
	await stakerInfo.deployed();

	//sfc
	// const sFC = new ethers.Contract("0x1c1cB00000000000000000000000000000000000",SFCAbi,sfcOwner);
	// tx = await sFC.updateStakeTokenizerAddress(stakeTokenizer.address);
	// await tx.wait();

	console.log("SGLXY : ", sGLXY.address);
	console.log("StakeTokenizer : ", stakeTokenizer.address);
	console.log("StakerInfo : ", stakerInfo.address);

	fs.writeFileSync(__dirname + '/contracts.json', JSON.stringify({
		SGLXY: sGLXY.address,
		StakeTokenizer: stakeTokenizer.address,
		StakerInfo: stakerInfo.address
	}))
}

main().then(() => console.log("complete".green)).catch((error) => {console.error(error);process.exit(1);});

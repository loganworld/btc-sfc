const fs = require("fs");
const colors = require("colors");
const { ethers } = require("hardhat");
const SFCAbi = require("../artifacts/contracts/sfc/SFC.sol/SFC.json").abi;
const contracts = require('../contracts')

async function main() {
	// get network
	var [sfcOwner] = await ethers.getSigners();

	/* let network = await sfcOwner.provider._networkPromise;
	let chainId = network.chainId; */

	console.log(chainId,sfcOwner.address);

    // var stakeTokenizer = {address : contracts.StakeTokenizer};

    const sFC = new ethers.Contract("0xeAb1000000000000000000000000000000000000", SFCAbi, sfcOwner);
    /* var tx = await sFC.updateStakeTokenizerAddress(stakeTokenizer.address);
    await tx.wait(); */
	const totalStake = await sFC.totalStake()


    console.log("totalStake : ", totalStake);

}

main()
	.then(() => {
		console.log("complete".green);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

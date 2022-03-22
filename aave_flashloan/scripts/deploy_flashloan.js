 
const hre = require("hardhat");

async function main() {
 
  // We get the contract to deploy
  const MyFlashLoan = await hre.ethers.getContractFactory("MyFlashLoan");
  const myFlashLoan = await MyFlashLoan.deploy("0x88757f2f99175387aB4C6a4b3067c77A695b0349");

  await myFlashLoan.deployed();

  console.log("myFlashLoan deployed to:", myFlashLoan.address);

  //
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

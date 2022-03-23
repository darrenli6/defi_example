 
const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const POOL_ADDR="0x9c6f958646105984Ec33069d164d01AA236fe11B";
  const TRANSFER_AMOUNT=9000 *10 **6;

  // We get the contract to deploy
  const MyFlashLoan = await hre.ethers.getContractFactory("MyFlashLoan");
  const myFlashLoan = await MyFlashLoan.deploy("0x88757f2f99175387aB4C6a4b3067c77A695b0349");

  await myFlashLoan.deployed();

  console.log("myFlashLoan deployed to:", myFlashLoan.address);
  
 

  const ERC20Factory =  await hre.ethers.getContractFactory("ERC20",owner);
  const eRC20USDC= await ERC20Factory.deploy();
  
  let balance =await eRC20USDC.balanceOf(owner.address);

  console.log(balance);
  
 await myFlashLoan.myFlashLoanCall();
    
  // let isSuc= await eRC20USDC.approve(myFlashLoan.address,TRANSFER_AMOUNT);
  
  // let isSucc= await myFlashLoan.depositToken(TRANSFER_AMOUNT);
  
  // console.log(isSucc);

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

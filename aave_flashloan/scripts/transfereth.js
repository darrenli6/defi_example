 
const hre = require("hardhat");

async function main() {
 
  // We get the contract to deploy
   
  const POOL_ADDR="0x9c6f958646105984Ec33069d164d01AA236fe11B";
  const TRANSFER_AMOUNT=1;


  const [owner] = await hre.ethers.getSigners();

  console.log(owner.address);

  const ERC20Factory =  await hre.ethers.getContractFactory("ERC20",owner);
  const eRC20USDC= await ERC20Factory.deploy();
  
  let balance =await eRC20USDC.balanceOf(owner.address);

  console.log(balance);
  
    
  let isSuc= await eRC20USDC.approve(POOL_ADDR,TRANSFER_AMOUNT);
  
  let isSucc= await eRC20USDC.transfer(POOL_ADDR,TRANSFER_AMOUNT);
  
  console.log(isSucc);

  
//   await owner.sendTransaction({
//       from : owner.address,
//   });

 
  

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

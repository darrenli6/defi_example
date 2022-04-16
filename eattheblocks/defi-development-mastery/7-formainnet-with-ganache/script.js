const Web3 = require('web3');
const daiAbi = require('./abi.js');

const recipientAddress = "0x5d84428236BF42caA0d89Dd4F8A28BDe9Dad63e4";
const unlockedAddress = "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7";
const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; 

const web3 = new Web3('http://localhost:8545'); 
const dai = new web3.eth.Contract(
  daiAbi,
  daiAddress
);

async function run() {
  let unlockedBalance, recipientBalance;

  ([unlockedBalance, recipientBalance] = await Promise.all([
    dai.methods
      .balanceOf(unlockedAddress)
      .call(),
    dai.methods
      .balanceOf(recipientAddress)
      .call()
  ]));
  console.log(`Balance unlocked: ${unlockedBalance}`);
  console.log(`Balance recipient: ${recipientBalance}`);

  
  await dai.methods
    .transfer(recipientAddress, 1000)
    .send({from: unlockedAddress});

  ([unlockedBalance, recipientBalance] = await Promise.all([
    dai.methods
      .balanceOf(unlockedAddress)
      .call(),
    dai.methods
      .balanceOf(recipientAddress)
      .call()
  ]));
  console.log(`Balance unlocked: ${unlockedBalance}`);
  console.log(`Balance recipient: ${recipientBalance}`);
}

run();

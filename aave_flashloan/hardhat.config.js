require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

 
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.7" },
      { version: "0.7.6" },
      { version: "0.8.0" },
      { version: "0.6.12" }
    ]
  },

  networks:{
    dev: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
    },
    kovan:{
      url: "https://kovan.infura.io/v3/18c8ae876f7f46e881287af88b7bee80",
      accounts:{
       mnemonic:mnemonic,
     }
   }
  }
};

 
const NFT = artifacts.require("./NFT");

const Token =artifacts.require("./Token")

module.exports =async function(callback){
     
    const [deployer,acc1,acc2,acc3] = await web3.eth.getAccounts();
    
    const nft = await NFT.deployed()
    const token =await Token.deployed()

    console.log(`NFT的合约地址 ${nft.address}`)
    console.log(`token的合约地址 ${token.address}`)

    console.log(`deployer 挖矿`)

    await nft.mint({from:deployer,value:0})

    console.log(`Ownwer of NFT before transfer : ${await nft.ownerOf(1)}`)



    callback()
}
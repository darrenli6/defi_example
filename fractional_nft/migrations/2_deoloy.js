const NFT = artifacts.require("./NFT");

const Token =artifacts.require("./Token")

module.exports= async function(deployer){

    const IPFS ="lijia"

    await deployer.deploy(
        NFT,
        "famous paintings",
        "FP",
        IPFS
    )


    const nft =await NFT.deployed()

    await deployer.deploy(
        Token,
        "Famous paintings token",
        "FPT",
        nft.address,
        1000
    )
}
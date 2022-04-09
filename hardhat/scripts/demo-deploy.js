const {ethers} = require("hardhat");

async function main(){
    console.log("hello");

    const Demo =await ethers.getContractFactory("Demo");
    const demo =await Demo.deploy();
    console.log(demo.address);
}


main().then(
    ()=>process.exit(9)

).catch(error=> {
    console.log(error);
    process.exit(1);
});
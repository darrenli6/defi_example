


const {ethers,upgrades} = require("hardhat")

async function main(){

    const Demo = await ethers.getContractFactory("Demo");
    console.log("deploying demo");
    const demo = await upgrades.deployProxy(Demo,[300],{initializer : 'setScore'});
    await demo.deployed()
    console.log("demo to ",demo.address)


}

main().then(
    ()=>process.exit(9)

).catch(error=> {
    console.log(error);
    process.exit(1);
});
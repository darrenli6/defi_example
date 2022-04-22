// 封装方法
const ether =(n)=>{
    return new web3.utils.BN(
       web3.utils.toWei(n.toString(),'ether')
    )
  
}
 const tokens = (n)=>ether(n)
const Vault = artifacts.require("Vault.sol")

contract("Vault",([deployer])=>{
    let vaultContract 

    beforeEach(async()=>{
        vaultContract = await Vault.new(30)

    })
    describe("存10 eher",()=>{

        beforeEach(async()=>{
            await vaultContract.deposit({from:deployer,value:ether(10)})
        })

        it("检查账户",async()=>{
            balanceOfContract = await vaultContract.balanceOfContract()
            const tenEther = ether(10).toString()
            assert(balanceOfContract.toString()== tenEther)
            console.log("balnace in ether  = ",parseInt(balanceOfContract.toString())/1e18)
        }) 

        it("检查时间",async()=>{
            const interval = await vaultContract.interval();
            assert(interval.toString()== (30).toString());
            console.log("second ",interval.toString())
        })

    })
})
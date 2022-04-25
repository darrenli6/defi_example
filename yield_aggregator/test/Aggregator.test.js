const Aggregator = artifacts.require('./Aggregator');
const daiABI= require('../src/helpers/dai-abi.json');
const cDAI_ABI= require('../src/helpers/cDai-abi.json');
const AAVE_ABI =require('../src/helpers/aaveLendingPool-abi.json');
const getAPY = require('../src/helpers/calculateAPY');
const { get } = require('babel-register/lib/cache');

require('chai')
.use(require('chai-as-promised')).should()


const DAI ="0x6B175474E89094C44Da98b954EedeAC495271d0F"
const cDAI= "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643"
const aaveLendingPool = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"


const EVM_REVERT = 'VM Exception while processing transaction: revert'


contract('集成测试',([deployer,user2])=>{

    const daiContract = new web3.eth.Contract(daiABI,DAI)
    const cDAI_contract =new web3.eth.Contract(cDAI_ABI,cDAI)
    const aaveLending_contract =new web3.eth.Contract(AAVE_ABI,aaveLendingPool)

    let aggregator

    beforeEach(async()=>{

        aggregator = await Aggregator.new()
    })

    describe('部署',()=>{

        it("名称",async()=>{
            const result =await aggregator.name()
            result.should.equal("Darren's Star Of the investment");
        })
    })


    describe("得到rate",()=>{
        it("得到compound的年化利率", async()=>{
            let result = await getAPY.getCompoundAPY(cDAI_contract)
            console.log(result.toString())
            result.should.not.equal(0)
        })

        it("得到aave的年化利率", async()=>{
            let result = await getAPY.getAaveAPY(aaveLending_contract)
            console.log(result.toString())
            result.should.not.equal(0)
        })
    })

    describe("存款", async()=>{

          let amount =10

          let amountInWei = web3.utils.toWei(amount.toString(),'ether')

          let compAPY,aaveAPY

          let result 

          describe("成功",async()=>{
              beforeEach(async()=>{

                compAPY =await getAPY.getCompoundAPY(cDAI_contract)

                aaveAPY =await getAPY.getAaveAPY(aaveLending_contract)

                // approve
                await daiContract.methods.approve(aggregator.address,amountInWei).send({from:deployer})

                // init deposit
                result =await aggregator.deposit(amountInWei,compAPY,aaveAPY,{from: deployer})



              })

              it('查看存款',async()=>{
                  let balance 

                  balance = await aggregator.amountDeposited.call();

                  balance.toString().should.equal(amountInWei.toString())
              })

              it("追踪存到哪里了",async()=>{
                  result = await aggregator.balanceWhere.call()
                  console.log(result)
              })

              it("触发事件",async()=>{
                  const log = result.logs[0]
                  log.event.should.equal("Deposit")
              })

             

          })


          describe("失败的情况",async()=>{

            it("如果没有授权的话",async()=>{
                await aggregator.deposit(amountInWei,compAPY,aaveAPY,{from :deployer}).should.be.rejectedWith(EVM_REVERT);

            })

            it("fails when amount is 0 ",async()=>{
                await aggregator.deposit(0,compAPY,aaveAPY,{from:deployer}).should.be.rejectedWith(EVM_REVERT);

            })
          })


    })

    describe("提现",async()=>{

          let compAPY,aaveAPY
          let amount =10
          let result 
          let amountInWei = web3.utils.toWei(amount.toString(),'ether')  
   
           beforeEach(async()=>{
              compAPY= await getAPY.getCompoundAPY(cDAI_contract)

              aaveAPY =await getAPY.getAaveAPY(aaveLending_contract)

              await daiContract.methods.approve(aggregator.address,amountInWei).send({from:deployer})

              await aggregator.deposit(amountInWei,compAPY,aaveAPY,{from:deployer})
      
           })

           it('触发提现事件',async()=>{
               result =await aggregator.withdraw({from:deployer})
               const log =result.logs[0]
               log.event.should.equal('Withdraw')
           })

           it("更新用户合约余额",async()=>{
               await aggregator.withdraw({from:deployer})
               result =  await aggregator.amountDeposited().call()
               result.toString().should.equal("0")
           })
 
    })

    describe("失败事件",async()=>{

        it("没有钱，提现不成功", async()=>{
            await aggregator.withdraw({from: deployer}).should.be.rejectedWith(EVM_REVERT);
        })

        it("用其他用户提现",async()=>{
            await aggregator.withdraw({from:user2}).should.be.rejectedWith(EVM_REVERT);
        })
    })

    describe("rebalance",async()=>{

      let compAPY ,aaveAPY

      describe("失败", async()=>{

          beforeEach(async()=>{

            compAPY = await getAPY.getCompoundAPY(cDAI_contract)
            aaveAPY = await getAPY.getAaveAPY(aaveLending_contract)

          })


          it("用户没有钱，无法执行函数",async()=>{
              await aggregator.rebalance(compAPY,aaveAPY,{from:deployer}).should.be.rejectedWith(EVM_REVERT);
          })

      })



    })

   


})


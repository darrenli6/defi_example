const {time}  = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const UnderlyingToken = artifacts.require('UnderlyingToken.sol');
const GovernanceToken = artifacts.require('GovernanceToken.sol');
const LiquidityPool = artifacts.require('LiquidityPool.sol');

contract('liquidityPool',accounts =>{
    const [admin,trader1,trader2 ]= accounts;
    let underlyingToken,governanceToken,liquidityPool;

    beforeEach(async ()=>{
        underlyingToken =await UnderlyingToken.new();
        governanceToken=await GovernanceToken.new();
        liquidityPool = await LiquidityPool.new(
            underlyingToken.address,
            governanceToken.address,
        );

        await governanceToken.transferOwnership(liquidityPool.address);
        await Promise.all([
            underlyingToken.faucet(trader1,web3.utils.toWei('1000')),
            underlyingToken.faucet(trader2,web3.utils.toWei('1000')),
        ]);

        
    });

    it("挖400法币",async()=>{
        // 授权给池子
        await underlyingToken.approve(
            liquidityPool.address,
            web3.utils.toWei('100'),
            {from:trader1},
        );
        
        await liquidityPool.deposit(web3.utils.toWei('100'),{from:trader1});
        await time.advanceBlock();
        await time.advanceBlock();
        await time.advanceBlock();
        
        await liquidityPool.withdraw(web3.utils.toWei('100'),{from : trader1});

        const balanceGovToken =await governanceToken.balanceOf(trader1);

        assert(web3.utils.fromWei(balanceGovToken.toString())==='400');
        


    });


    it('挖600 法币',async ()=>{
       await underlyingToken.approve(
           liquidityPool.address,
           web3.utils.toWei('100'),
           {from: trader1},
       );  // this. tx will add ablock

       await liquidityPool.deposit(web3.utils.toWei('100'),{from : trader1 });

       await time.advanceBlock();
       await time.advanceBlock();
       await time.advanceBlock();
       await time.advanceBlock();

       await underlyingToken.approve(
        liquidityPool.address,
        web3.utils.toWei('100'),
        {from: trader1},
    );  // this. tx will add ablock

    await liquidityPool.deposit(web3.utils.toWei('100'),{from : trader1 });

    const balance = await governanceToken.balanceOf(trader1); 

    assert(web3.utils.fromWei(balance.toString())=== '600');







    });
});

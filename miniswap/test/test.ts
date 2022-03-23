import { expect, use } from 'chai'
import { solidity } from 'ethereum-waffle'
import { ethers } from 'hardhat'
import { Token } from '../typechain/Token'
import { MiniSwap } from '../typechain/MiniSwap'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

use(solidity)


describe("Miniswap",function(){
   let eth: Token
   let dai: Token
   let pool:  MiniSwap
   let accounts : SignerWithAddress[]

   this.beforeEach(async ()=>{
      accounts =await ethers.getSigners();

      const Token = await ethers.getContractFactory("Token");

      eth = await Token.deploy('Ethereum', 'ETH', 100000000000) as Token
      dai = await Token.deploy('DAI', 'DAI', 1000000000000000) as Token

      await eth.deployed()
      await dai.deployed()

      const [, accoun1, account2,account3, account4]= accounts

      for (const account of [accoun1, account2,account3, account4]){
         await (await eth.transfer(account.address,200)).wait()
         await (await dai.transfer(account.address,10000000)).wait()
      }

      const MiniSwap = await ethers.getContractFactory("MiniSwap")

      pool =await MiniSwap.deploy(eth.address,dai.address) as MiniSwap
      await pool.deployed()

 
   });


   it("初始化资金池 ", async function(){
      expect( await pool.token0() ).to.equal(eth.address)
      expect( await pool.token1() ).to.equal(dai.address)
      expect( await pool.reserve0()).to.equal(0)
      expect( await pool.reserve1()).to.equal(0)
   })


   it("初始化加入流动性 ", async function(){
        await (await eth.connect(accounts[1]).approve(pool.address,1)).wait()
        await (await dai.connect(accounts[1]).approve(pool.address,2000)).wait()
        await (await pool.connect(accounts[1]).add(1,2000)).wait()

        expect(await pool.reserve0()).to.equal(1)
        expect(await pool.reserve1()).to.equal(2000) 

        expect(await pool.totalSupply()).to.equal(100000);
        expect(await pool.balanceOf(accounts[1].address)).to.equal(100000);


   })


   it("添加流动性",async function(){

      await (await eth.connect(accounts[1]).approve(pool.address,1)).wait()
      await (await dai.connect(accounts[1]).approve(pool.address,2000)).wait()
      await (await pool.connect(accounts[1]).add(1,2000)).wait()

      await (await eth.connect(accounts[2]).approve(pool.address,3)).wait()
      await (await dai.connect(accounts[2]).approve(pool.address,6000)).wait()
      await (await pool.connect(accounts[2]).add(3,6000)).wait()


      expect(await pool.reserve0()).to.equal(4)
      expect(await pool.reserve1()).to.equal(8000) 
      console.log(await pool.reserve0())

      expect(await pool.totalSupply()).to.equal(400000);

      expect(await pool.balanceOf(accounts[1].address)).to.equal(100000)
      expect(await pool.balanceOf(accounts[2].address)).to.equal(300000)

   })






   


});


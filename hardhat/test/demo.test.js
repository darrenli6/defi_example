const {expect}  = require("chai")

const {ethers }= require("hardhat");

describe("Demo测试", ()=>{

    // 测试之前的钩子函数

    before(async function(){

          this.Demo = await ethers.getContractFactory("Demo")
          this.demo = await this.Demo.deploy()
    })


    it("测试分数",async function(){
        const score = await this.demo.score()
        expect(score.toString()).to.be.equal('0')
    });

    it("修改分数",async function(){
        await this.demo.setScore(100)
        const score = await this.demo.score()
        expect(score.toString()).to.be.equal('100')
    });

});
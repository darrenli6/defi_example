const { default: Web3 } = require('web3');

const NFT =artifacts.require('./NFT');
const Token=artifacts.require('./Token');

require('chai').use(require('chai-as-promised')).should()

contract('NFT测试',([deployer,acc1])=>{

    const nftName="Famous Paintings"
    const nftSymbol ="FP"

    const tokenName="Famous Paintings Token"
    const tokenSymbol = "FPT";
    const tokenSupplyPerNft =1000

    let nft,token 

    before(async()=>{
        nft =await NFT.new(
            nftName,
            nftSymbol,
            "ipfs//lijia/"
        )

        token = await Token.new(
            tokenName,
            tokenSymbol,
            nft.address,
            tokenSupplyPerNft
        )

    })

    describe("nft部署",()=>{

        it("返回部署者地址",async()=>{
            const result = await nft.owner()
            result.should.equal(deployer)
        })

        it("返回name",async()=>{
            const result =await nft.name()
            result.should.equal(nftName)
        })

        it("返回symbol",async()=>{
            const result=await nft.symbol()
            result.should.equal(nftSymbol);
        })
    })


    describe("测试token合约",()=>{

        it("测试token name",async()=>{
            const result =await token.name();
            result.should.equal(tokenName)
        })
        it("测试token symbol",async()=>{
            const result =await token.symbol()
            result.should.equal(tokenSymbol)
        })

        it("测试 nft 地址",async()=>{
            const result = await token.nftAddress()
            result.should.equal(nft.address)
        })
        it("测试每个nft的token数值",async()=>{
            const result = await token.supplyPerNFT()
            result.toString().should.equal(tokenSupplyPerNft.toString())
        })
    })

    describe("转账", ()=>{



        let result 

        describe("成功",()=>{
            beforeEach(async()=>{
                await nft.mint({from:deployer,value:0})
            })

            it("卖钱",async()=>{
                // 将nft1 转入token地址
                await nft.approve(token.address,1,{from :deployer})
                // 我就可以得到1000token
                await token.convertToTokens(1,{from:deployer})

                result =await token.balanceOf(deployer)
                result.toString().should.equal('1000')
            })
            
            it("成功转账",async()=>{
                await nft.mint({from:deployer,value:0})
                result = await nft.ownerOf(2)
                result.should.equal(deployer)

                await nft.approve(token.address,2,{from:deployer})
                await token.convertToTokens(2,{from:deployer})

                result =await nft.ownerOf(2)
                result.should.equal(token.address)
 

            })
        })

        describe("失败的情况",()=>{

              beforeEach(async()=>{
                  await nft.mint({from:acc1,value:Web3.utils.toWei('1','ether')})
              })

              it("没有授权",async()=>{
                  await token.convertToTokens(1,{from:deployer}).should.be.rejected
              })

        })

    })




});
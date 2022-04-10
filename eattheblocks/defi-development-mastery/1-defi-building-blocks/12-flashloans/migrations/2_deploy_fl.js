const LpToken  =artifacts.require('LpToken.sol');
const FlashloanProvider  =artifacts.require('FlashloanProvider.sol');
const ExampleFlashloanUser  =artifacts.require('ExampleFlashloanUser.sol');

module.exports =async function (deployer,_network,addresses){
    const [admin,_] = addresses;

    await deployer.deploy(LpToken);

    const lpToken = await LpToken.deployed();
 
  

    await Promise.all([
        lpToken.faucet(admin, web3.utils.toWei('1000')),
       
      ]);

    const tpbalance= await lpToken.balanceOf(admin);   
    console.log("admin has "+web3.utils.fromWei(tpbalance.toString())  );

    await deployer.deploy(FlashloanProvider,[lpToken.address]); 

    const flashloanProvider = await FlashloanProvider.deployed(); 

    console.log("flashloanProvider address ",flashloanProvider.address);


    await deployer.deploy(ExampleFlashloanUser);
    
    const exampleFlashloanUser = await ExampleFlashloanUser.deployed(); 


    // 将我钱打入合约 
    const beforeBalance =await lpToken.balanceOf(flashloanProvider.address);
    console.log("之前",web3.utils.fromWei(beforeBalance.toString()));
    
    // 授权打钱
    await lpToken.approve(flashloanProvider.address,web3.utils.toWei('1000'));
    await lpToken.transfer(flashloanProvider.address,web3.utils.toWei('1000'));
    const afterBalance =await lpToken.balanceOf(flashloanProvider.address);
    console.log("之后",web3.utils.fromWei(afterBalance.toString()));
    

    await exampleFlashloanUser.startFlashloan(flashloanProvider.address,
        web3.utils.toWei('1000'),
        lpToken.address
        );
        
    const afterflashBalance =await lpToken.balanceOf(flashloanProvider.address);
        console.log("flash之后",web3.utils.fromWei(afterflashBalance.toString()));
        

 

}
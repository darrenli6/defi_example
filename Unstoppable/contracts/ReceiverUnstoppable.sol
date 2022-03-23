// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./UnstoppableLender.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ReceiverUnstoppable
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */
contract ReceiverUnstoppable {

   UnstoppableLender private immutable pool ;
    
   address private immutable owner;

   constructor(address poolAddress){
       pool = UnstoppableLender(poolAddress);
         console.log("poolAddress ",poolAddress);
       owner =msg.sender;
   }  

   // 实现接口  
    function receiveTokens(address tokenAddress,uint256 amount )external{

         console.log("3 receiveTokens  (%s)   %s ",tokenAddress, amount);
         require(msg.sender == address(pool),"sender must be pool ");
         console.log("pool address ",msg.sender);
         console.log("owner ",owner);
        
   //  归还所有的token给pool
   
         require(IERC20(tokenAddress).transfer(msg.sender,amount));

    }

    function  executeFlashLoan(uint256 amount ) external{
        // 调用
        require(msg.sender ==owner ,"Only owner can execute flash loan");
        console.log("1 start flash loan");
        pool.flashLoan(amount);
    }
}
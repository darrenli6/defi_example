pragma solidity 0.6.12;


import {ILendingPoolAddressesProvider,ILendingPool,IERC20}  from './interfaces.sol';

import {SafeMath} from './Libraries.sol';

import { FlashLoanReceiverBase } from './FlashLoanReceiverBase.sol';

 
 

contract  MyFlashLoan is FlashLoanReceiverBase {

     using SafeMath for uint256;

   
     
    address private KOVAN_USDC = 0xe22da380ee6B445bb8273C81944ADEB6E8450422;
    address public KOVAN_AAVE = 0xB597cd8D3217ea6477232F9217fa70837ff667Af;
    address public KOVAN_DAI = 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD;

    address public AAVE_LENDING_POOL_IN_KOVAN= address(0x88757f2f99175387aB4C6a4b3067c77A695b0349);

     constructor(ILendingPoolAddressesProvider _address) FlashLoanReceiverBase(_address) public{
            
     }


     // 回调方法 executeOperation
     //  IFlashLoanReceiver
     function executeOperation(
         address[] calldata assets,
         uint256[] calldata amounts, 
         uint256[] calldata premiums, 
         address initiator, 
         bytes calldata params) external override returns(bool) {
         
      
      /*
      Do something 
      套利,
      实施清算
      交换抵押品

      */

       // 如果借多种资产
       for (uint8 i=0;i<assets.length;i++){
           // 本金 + 手续费  本金 +0.09%的手续费
           uint amountOwing = amounts[i].add(premiums[i]);
           IERC20(assets[i]).transfer(address(LENDING_POOL),amountOwing);
       }

       return true;

     }

     function depositToken(uint256 amount) external returns(bool) {
        
         return usdcToken.transferFrom(msg.sender, address(this), amount);

     }

     function myFlashLoanCall() public{

         address receiverAddress = address(this);

         // 借一种资产 usdc
         address[] memory assets =new address[](1);
         assets[0]= KOVAN_USDC;

         uint256[] memory amounts= new uint256[](1);
         // https://kovan.etherscan.io/token/0xe22da380ee6B445bb8273C81944ADEB6E8450422
         // decimal 为6 
         amounts[0]=1_000_000 *10**6;
         
         uint256[] memory modes =new uint256[](1);
         // 1 固定利率
         // 2 动态利率
         // 0 flashloan 1 stable 2 varibale 
         modes[0]=0;

         address borrower= address(this);

         // 痕迹
         bytes memory param = "CryptoDarren";

         uint16 referralCode =0 ;

         
         LENDING_POOL.flashLoan(
             receiverAddress ,
             assets,
             amounts,
             modes,
             borrower,
             param,
             referralCode  
         );






     }

}
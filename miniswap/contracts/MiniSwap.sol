//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract MiniSwap is ERC20{

   address public token0;
   address public token1;


   // Reserve of toke
   uint public reserve0;
   uint public reserve1 ;

   uint public constant INITIAL_SUPPLY= 10**5;

   constructor(address _token0,address _token1) ERC20("miniswap","LP"){
       token0=_token0;
       token1=_token1;

   }

   /*
   添加流动性
   生成lp
   更新储备量

   */

   function add(uint amount0,uint amount1) public {
       assert(IERC20(token0).transferFrom(msg.sender,address(this),amount0));
       assert(IERC20(token1).transferFrom(msg.sender,address(this),amount0));
      
       uint reserve0After =reserve0 + amount0;
       uint reserve1After =reserve1 + amount1;

       if (reserve0 == 0 && reserve1 == 0){
           _mint(msg.sender,INITIAL_SUPPLY);
       }else{
           uint currentSupply = totalSupply();
           uint newSupplyGivenReserve0Ratio = reserve0After * currentSupply / reserve0;
           uint newSupplyGivenReserve1Ratio = reserve1After * currentSupply / reserve1;
           uint newSupply = Math.min(newSupplyGivenReserve0Ratio,newSupplyGivenReserve1Ratio);
           _mint(msg.sender,newSupply-currentSupply);
       }

       reserve0 =reserve0After;
       reserve1 =reserve1After;

   }

   /*
    移除流动性
    我的lp从钱包转移到合约
    燃烧lp
    更新储备量

   */

   function remove(uint liquidity) public{
       assert(transfer(address(this),liquidity));

       uint currentSupply =totalSupply();

       uint amount0 =   liquidity * reserve0/ currentSupply;
       uint amount1 =   liquidity * reserve1/ currentSupply;

       _burn(address(this),liquidity);

       assert(IERC20(token0).transfer(msg.sender,amount0));
       assert(IERC20(token1).transfer(msg.sender,amount1));

       reserve0 =reserve0-amount0;
        reserve1=reserve1-amount1;
    
   }

   /*  
   根据 x*y=k 
   可得到新的储备量
   */

   function _getAmountOut(uint amountIn,address fromToken) public view returns(uint amountOut,uint _reserve0,uint _reserve1){

        uint newReserve0;
        uint newReserve1;

        uint k = reserve0 * reserve1;

        if (fromToken == token0){
            newReserve0 = amountIn +reserve0;
            newReserve1 = k / newReserve0;
            amountOut = reserve1 -newReserve1; 
        }else{

            newReserve1= amountIn +reserve1;
            newReserve0 = k / newReserve1;
            amountOut = reserve0 -newReserve0; 
        }

        _reserve0=newReserve0; 
        _reserve1=newReserve1;

   }



   /*
    兑换 
    用fromToken换toTken

   */

   function swap(uint amountIn,uint minAmountOut,address fromToken,address toToken, address to) public{

       require(amountIn >0 && minAmountOut >0,"Amount invalid");
       require(fromToken== token0 || fromToken ==token1 ,"invalid token");
       require(toToken== token0 || toToken ==token1 ,"invalid token");
       require(fromToken !=toToken , " should not match ");

       (uint amountOut,uint newReserve0,uint newReserve1) = _getAmountOut(amountIn, fromToken);

       
       require(amountOut >= minAmountOut," no ");

       assert(IERC20(fromToken).transferFrom(msg.sender,address(this),amountIn));
       assert(IERC20(toToken).transfer(to,amountOut));

       reserve0 = newReserve0;
       reserve1 = newReserve1;


   }


}

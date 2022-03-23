pragma solidity 0.6.12;


import { IERC20 } from "./interfaces.sol";

contract ERC20  {
    address private KOVAN_USDC = 0xe22da380ee6B445bb8273C81944ADEB6E8450422;
 
     function balanceOf(address addr) public view returns(uint256){
           return IERC20(KOVAN_USDC).balanceOf(addr);
     }
     function transfer(address to, uint256 amount) external returns (bool){
           return IERC20(KOVAN_USDC).transfer(to,amount);
    }  

      function approve(address spender, uint256 amount) external returns (bool){
            return IERC20(KOVAN_USDC).approve(spender,amount);
      }

       function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool){
         return IERC20(KOVAN_USDC).transferFrom(from,to,amount);
    }


     
}

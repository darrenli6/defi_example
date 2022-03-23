// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract NaiveReceiverLenderPool is ReentrancyGuard {


    using Address for address ;

    uint256 private constant FIXED_FEE =1 ether;

    function fixedFee() external pure returns(uint256){
        return FIXED_FEE;
    }

    function flashLoan(address borrow,uint borrowAmount) external nonReentrant
    {

       uint256 balanceBefore = address(this).balance;
       require(balanceBefore >= borrowAmount,"Not Enough");
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Demo{
    uint256 public score =0 ;

    function setScore(uint256 newScore) public returns(bool){
        score = newScore;
        return true;
    }

    function increment() public {
        score = score +1;
    }
}
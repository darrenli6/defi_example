pragma solidity ^0.7.3;

import "./UnderlyingToken.sol";
import "./LpToken.sol";
import "./GovernanceToken.sol";
 

 contract LiquidityPool is LpToken{
  
   mapping(address => uint) public checkpoints; 
   UnderlyingToken public underlyingToken;
   GovernanceToken public governanceToken;

   uint constant public REWAR_PER_BLOCK= 1; 

   constructor(address _underlyingToken,address _governanceToken){
       underlyingToken=UnderlyingToken(_underlyingToken);
       governanceToken=GovernanceToken(_governanceToken);
   }

   function deposit(uint amount) external{
       if (checkpoints[msg.sender]==0){
           checkpoints[msg.sender] = block.number;
       }

      // 分发go
       _distributeRewards(msg.sender);
       // 抵押
       underlyingToken.transferFrom(msg.sender,address(this),amount);
      // LP释放
       _mint(msg.sender,amount);
       
   }


   function withdraw(uint amount) external{
       require(balanceOf(msg.sender)>=amount,"not enough lp token");
       _distributeRewards(msg.sender);
       underlyingToken.transfer(msg.sender,amount);
       _burn(msg.sender,amount);
       
   }


   function _distributeRewards(address beneficiary) internal{

     uint checkpoint = checkpoints[beneficiary];

     if(block.number- checkpoint>0 ){
         uint distributionAmount = (balanceOf(beneficiary) * (block.number -checkpoint)* REWAR_PER_BLOCK );
         governanceToken.mint(beneficiary,distributionAmount);
         // 更新
         checkpoints[beneficiary]= block.number;
     }
        
   }

 }
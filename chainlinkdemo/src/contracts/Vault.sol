pragma solidity ^0.8.2;
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";


contract Vault is KeeperCompatibleInterface{
    address public owner ;
    

    constructor(uint updateInterval){
        owner =msg.sender;
        interval = updateInterval;
        lastTimeStamp = block.timestamp;
    }

    function deposit() external payable{}


    function balanceOfContract() external view returns(uint256){
        return address(this).balance;
    }


    uint public immutable interval;
    uint public lastTimeStamp;

      function checkUpkeep(bytes calldata checkData) external override returns (bool upkeepNeeded, bytes memory performData)
      {
             upkeepNeeded = (block.timestamp-lastTimeStamp) > interval;
      }
   
  function performUpkeep(bytes calldata performData) external override{
      if((block.timestamp-lastTimeStamp) > interval){
          lastTimeStamp = block.timestamp;
          payable(address(owner)).transfer(0.1 ether);
      }
  }

  
}

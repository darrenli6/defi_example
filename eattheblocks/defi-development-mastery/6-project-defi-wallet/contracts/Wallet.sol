pragma solidity ^0.7.3;
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "./Compound.sol";

contract Wallet is Compound{
    address public admin;

    constructor(
        address _comptroller,
        address _cEthAddress
    ) Compound(_comptroller,_cEthAddress){
      admin =msg.sender;
    }


    function deposit(address cTokenAddress,
        uint underlyingAmount
    ) external{
        // 获取抵押品资产地址
      address underlyingAddress = getUnderlyingAddress(cTokenAddress);
      IERC20(underlyingAddress).transferFrom(msg.sender,address(this),underlyingAmount);
      supply(cTokenAddress, underlyingAmount); 
    }

    receive() external payable{
        supplyEth(msg.value);
    }

    modifier onlyAdmin(){
        require(msg.sender == admin,"only admin");
        _;
    }

    function withdraw(
        address cTokenAddress,
        uint underlyingAmount,
        address recipient
    ) onlyAdmin() external{
       
       require(
           getUnderlyingBalance(cTokenAddress) >= underlyingAmount,
           "balance too low"
       );
       // 
       claimComp();
       // 归还
       redeem(cTokenAddress, underlyingAmount);
       // 通过 ctoken的得到抵押资产的地址
       address underlyingAddress = getUnderlyingAddress(cTokenAddress);
       IERC20(underlyingAddress).transfer(recipient,underlyingAmount);

       // 得到comp利息
       address compAddress = getCompAddress();
       IERC20 compToken = IERC20(compAddress);
       uint compAmount = compToken.balanceOf(address(this));
       compToken.transfer(recipient,compAmount);

    }

    function withdrawEth(
        uint underlyingAmount,
        address payable recipient
    ) onlyAdmin() external{
       require(
           getUnderlyingEthBalance() >= underlyingAmount,
           "balance too low"
       );
       claimComp();
       // 赎回
       redeemEth(underlyingAmount);
       recipient.transfer(underlyingAmount);

         // 得到comp利息
       address compAddress = getCompAddress();
       IERC20 compToken = IERC20(compAddress);
       uint compAmount = compToken.balanceOf(address(this));
       compToken.transfer(recipient,compAmount);

    }
}
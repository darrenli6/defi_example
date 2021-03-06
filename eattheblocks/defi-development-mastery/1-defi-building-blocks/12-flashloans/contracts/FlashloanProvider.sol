
pragma solidity ^0.7.3;


import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import './IFlashloanUser.sol';

contract FlashloanProvider is ReentrancyGuard{

    mapping(address=> IERC20) public tokens;

    constructor(address[] memory _tokens){
        for(uint8 i =0;i<_tokens.length;i++){
            tokens[_tokens[i]] = IERC20(_tokens[i]);
        }
    }

    function executeFlashloan(
        address callback,
        uint amount,
        address _token,
        bytes memory data
    ) nonReentrant() external{
        IERC20 token = tokens[_token];

        uint originalBalance = token.balanceOf(address(this));
        require(address(_token) !=address(0),"token is not valid");
        require(originalBalance >= amount,"amount to high");
        // 转给 用户
        token.transfer(callback,amount);
        //  做一些事情  转回银行
        IFlashloanUser(callback).flashloanCallback(amount,_token,data);
       // 检查一下
        require(
            token.balanceOf(address(this))== originalBalance,
            "flashloan not reimbursed "
        );

    }
}



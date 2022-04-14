pragma solidity ^0.7.3;


import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './FlashloanProvider.sol';
import './IFlashloanUser.sol';

contract ExampleFlashloanUser is IFlashloanUser {
    event Log(string  message,uint  value);
    function startFlashloan(
        address flashloan,
        uint amount,
        address token
    ) external {

        FlashloanProvider(flashloan).executeFlashloan(
            // 转到这里
          address(this),
          amount,
          token,
          bytes('')
        );
    }

    function flashloanCallback(
        uint amount,
        address token,
        bytes memory data
    ) override external{
        // do something 

        // Reimburse borrowed tokens
        // msg.sender provider
        emit Log("callback is called", amount);
        
        IERC20(token).transfer(msg.sender,amount);
    }
}
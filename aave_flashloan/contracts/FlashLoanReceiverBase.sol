pragma solidity 0.6.12;

import {IFlashLoanReceiver,ILendingPoolAddressesProvider,ILendingPool,IERC20}  from './interfaces.sol';

import {SafeERC20,SafeMath} from './Libraries.sol';
/*
参考https://github.com/aave/aave-protocol/tree/master/contracts/flashloan/base
*/
abstract contract FlashLoanReceiverBase is IFlashLoanReceiver{


    using SafeERC20 for IERC20;

    using SafeMath for uint256;

    ILendingPoolAddressesProvider public immutable ADDRESSES_PROVIDER;

    ILendingPool public immutable LENDING_POOL;

    constructor(ILendingPoolAddressesProvider provider) public {
        ADDRESSES_PROVIDER =provider;
        LENDING_POOL = ILendingPool(provider.getLendingPool());
    }
}
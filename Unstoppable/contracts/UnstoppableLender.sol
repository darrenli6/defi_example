// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IReceiver {
    function receiveTokens(address tokenAddress, uint256 amount) external;
}

/**
 * @title UnstoppableLender
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */
contract UnstoppableLender is ReentrancyGuard {

    IERC20 public immutable damnValuableToken;
    uint256 public poolBalance;

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Token address cannot be zero");
        damnValuableToken = IERC20(tokenAddress);
        console.log("damnValuableToken ",tokenAddress);
    }

// 存token
    function depositTokens(uint256 amount) external nonReentrant {
        require(amount > 0, "Must deposit at least one token");
        // Transfer token from sender. Sender must have first approved them.
        damnValuableToken.transferFrom(msg.sender, address(this), amount);
        poolBalance = poolBalance + amount;
    }

    function flashLoan(uint256 borrowAmount) external nonReentrant {
        require(borrowAmount > 0, "Must borrow at least one token");

        uint256 balanceBefore = damnValuableToken.balanceOf(address(this));
        require(balanceBefore >= borrowAmount, "Not enough tokens in pool");

        // Ensured by the protocol via the `depositTokens` function
        // 这里有漏洞
        assert(poolBalance == balanceBefore);
        // 转移到我这里了
        console.log("msg.sender ",msg.sender);
        console.log("2 transfer %s   %s ",msg.sender, borrowAmount);
        damnValuableToken.transfer(msg.sender, borrowAmount);
        
        
        // 我接受到了 

        
        IReceiver(msg.sender).receiveTokens(address(damnValuableToken), borrowAmount);

        console.log("address(damnValuableToken)  ",address(damnValuableToken));
        
        uint256 balanceAfter = damnValuableToken.balanceOf(address(this));
        // 因为有手续费了么
        require(balanceAfter >= balanceBefore, "Flash loan hasn't been paid back");
    }
}

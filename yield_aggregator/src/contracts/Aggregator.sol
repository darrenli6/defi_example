pragma solidity ^0.5.16;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

interface DAI{
    function approve(address,uint256) external returns(bool);

    function transfer(address,uint256) external returns(bool);

    function transferFrom(address, address ,uint256) external returns(bool);

    function balanceOf(address) external view returns(uint256);

}

interface cDAI{
    function mint(uint mintAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function supplyRatePerBlock() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);

}


interface aDAI{
      function balanceOf(address owner) external view returns (uint);
}


// Interface for Aave's lending pool contract
interface AaveLendingPool {
    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external;

    function getReserveData(address asset)
        external
        returns (
            uint256 configuration,
            uint128 liquidityIndex,
            uint128 variableBorrowIndex,
            uint128 currentLiquidityRate,
            uint128 currentVariableBorrowRate,
            uint128 currentStableBorrowRate,
            uint40 lastUpdateTimestamp,
            address aTokenAddress,
            address stableDebtTokenAddress,
            address variableDebtTokenAddress,
            address interestRateStrategyAddress,
            uint8 id
        );
}

contract Aggregator{


    using SafeMath for uint256;



    string public name="Darren's Star Of the investment";

    address public owner ;
    address public locationOfFunds;
    uint256 public amountDeposited;

    DAI dai = DAI(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    cDAI cDai = cDAI(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643);
    aDAI aDai = aDAI(0x028171bCA77440897B824Ca71D1c56caC55b68A3);
    AaveLendingPool aaveLendingPool =
        AaveLendingPool(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9);

        // Event 

    event Deposit(address owner,uint256 amount,address depositTo);
    event Withdraw(address owner,uint256 amount,address withdrawFrom);
    event Rebalance(address owner,uint256 amount, address depsitTo);

    modifier onlyOwner(){
        require(msg.sender ==owner);
        _;
    }

    constructor() public{
        owner=msg.sender;
    }


    function deposit(
        uint256 _amount,
        uint256 _compAPY,
        uint256 _aaveAPY
    )public onlyOwner{
        require(_amount>0);
        // 如果已经存款了
        if(amountDeposited >0){
            rebalance(_compAPY,_aaveAPY);
        }
        dai.transferFrom(msg.sender,address(this),_amount);

        amountDeposited = amountDeposited.add(_amount);

        // 比较利率
        if(_compAPY > _aaveAPY){

            require(_depositToCompound(_amount)==0);

            locationOfFunds= address(cDai);


        }else{

            _depositToAave(_amount);

            locationOfFunds = address(aaveLendingPool);
        }

        emit Deposit(msg.sender, _amount,locationOfFunds);
 
       
    }

    function withdraw() public onlyOwner{
        require(amountDeposited > 0 );
 // 取现到本合约
        if(locationOfFunds == address(cDai)){
            require(_withdrawFromCompound()==0);
        }else{
            _withdrawFromAave();
        }

       

    // 再提现 
     uint256 balance = dai.balanceOf(address(this));
     dai.transfer(msg.sender, balance);

     emit Withdraw(msg.sender, balance, locationOfFunds);



     // reset user balnace 
     amountDeposited =0 ;
    }

    function rebalance(uint256 _compAPY,uint256 _aaveAPY) public onlyOwner{
        require(amountDeposited > 0);

        uint256 balance;

        // 如果在aave的pool中 就需要调仓
        if((_compAPY > _aaveAPY) && (locationOfFunds!=address(cDai))){

          
          _withdrawFromAave();
          balance = dai.balanceOf(address(this));
          _depositToCompound(balance);

          // 更新
          locationOfFunds= address(cDai);

          emit Rebalance(msg.sender, amountDeposited,locationOfFunds );
        }else if((_compAPY < _aaveAPY) && (locationOfFunds!=address(aaveLendingPool))){
           _withdrawFromCompound();

           balance = dai.balanceOf(address(this));

           _depositToAave(balance);

           locationOfFunds = address(aaveLendingPool);

           emit Rebalance(msg.sender, balance,locationOfFunds );
        }
    }


    function _depositToCompound(uint256 _amount) internal returns(uint256){
        require(dai.approve(address(cDai), _amount));

        uint256 result = cDai.mint(_amount);
        return result;
    }

    function _depositToAave(uint256 _amount) internal returns(uint256){
        require(dai.approve(address(aaveLendingPool),  _amount));
        aaveLendingPool.deposit(address(dai), _amount, address(0), 0);
    }
 


    function _withdrawFromAave() internal{
        uint256 balance =aDai.balanceOf(address(this));
        // 取dai
        aaveLendingPool.withdraw(address(dai), balance, address(this));
    } 

    function _withdrawFromCompound() internal returns(uint256){
        uint256 balance = cDai.balanceOf(address(this));
        // 取钱
        uint256 result = cDai.redeem(balance);
    }


    //--

    function balanceOfContract() public view returns(uint256){
        if(locationOfFunds== address(cDai)){
            return cDai.balanceOf(address(this));
        }else{
            return aDai.balanceOf(address(this));
        }
    }


    function balanceWhere() public view returns(address){
        return locationOfFunds;
    }




}
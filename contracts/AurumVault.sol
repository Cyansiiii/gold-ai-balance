// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IQIEOracle.sol";

interface IQIEDexRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address calldata path,
        address to,
        uint deadline
    ) external returns (uint memory amounts);
}

contract AurumVault is Ownable {
    IERC20 public qieToken;  // Wrapped QIE (WQIE)
    IERC20 public stableToken; // USDT or Stable
    IERC20 public rewardToken; // $ARM Token
    IQIEOracle public oracle;
    IQIEDexRouter public dexRouter;
    address public aiAgent;
    
    // State to track if we are in "Risk On" (QIE) or "Risk Off" (Stable)
    bool public isRiskOn = true; 
    
    event Deposit(address indexed user, uint256 amount);
    event Rebalanced(string newMode, uint256 amountSwapped);

    constructor(
        address _qieToken, 
        address _stableToken, 
        address _rewardToken, 
        address _oracle, 
        address _dexRouter,
        address _aiAgent
    ) Ownable(msg.sender) {
        qieToken = IERC20(_qieToken);
        stableToken = IERC20(_stableToken);
        rewardToken = IERC20(_rewardToken);
        oracle = IQIEOracle(_oracle);
        dexRouter = IQIEDexRouter(_dexRouter);
        aiAgent = _aiAgent;
    }

    modifier onlyAgent() {
        require(msg.sender == aiAgent, "Not authorized AI Agent");
        _;
    }

    // 1. User Deposits
    function deposit(uint256 amount) external {
        // In a real app, you'd mint LP tokens here. For demo, simple deposit.
        qieToken.transferFrom(msg.sender, address(this), amount);
        
        // Drip some $ARM rewards to the user (Simulated Yield)
        rewardToken.transfer(msg.sender, 10 * 10**18); 
        emit Deposit(msg.sender, amount);
    }

    // 2. The Core AI Function
    function executeRebalance(bool toStable) external onlyAgent {
        // Oracle Guardrail: Check Gold price before allowing a swap
        int256 goldPrice = oracle.getLatestPrice("GOLD");
        require(goldPrice > 0, "Oracle offline");

        if (toStable && isRiskOn) {
            // Sell QIE -> Stable
            uint256 balance = qieToken.balanceOf(address(this));
            _swap(address(qieToken), address(stableToken), balance);
            isRiskOn = false;
            emit Rebalanced("Risk Off (Gold/Stable)", balance);
        } 
        else if (!toStable && !isRiskOn) {
            // Buy Stable -> QIE
            uint256 balance = stableToken.balanceOf(address(this));
            _swap(address(stableToken), address(qieToken), balance);
            isRiskOn = true;
            emit Rebalanced("Risk On (QIE)", balance);
        }
    }

    function _swap(address _in, address _out, uint256 _amount) internal {
        require(_amount > 0, "Zero balance");
        address[] memory path = new address[](2);
        path[0] = _in;
        path[1] = _out;

        IERC20(_in).approve(address(dexRouter), _amount);
        
        // 50% slippage tolerance for hackathon demo purposes
        dexRouter.swapExactTokensForTokens(
            _amount, 
            0, 
            path, 
            address(this), 
            block.timestamp + 300
        );
    }
}

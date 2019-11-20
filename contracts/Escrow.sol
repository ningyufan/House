pragma solidity ^0.4.13;

contract Escrow{
    uint public productId;
    address public buyer;
    address public seller;
    address public arbiter;
    uint public amount;
    mapping (address => bool) releaseAmount; //记录参与者是否已经投过票
    uint public releaseCount;                //有几个参与者同意释放资金
    bool public fundsDisbursed;              //资金是否已经流出托管账户
    mapping (address => bool) refundAmount;  //记录参与者是否已经投过票
    uint public refundCount;                 //有几个参与者同意返还资金

    function Escrow(uint _productId, address _buyer,
                    address _seller, address _arbiter) payable public {
        //保存商品编号
        productId = _productId;
        //保存参与三方的账户地址
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
        //只有声明了payable的函数，msg.value才有效
        amount = msg.value;
    }

    function releaseAmountToSeller(address caller) public {
        //如果资金已经流出，则终止函数执行
        require(!fundsDisbursed);
        //只有托管合约的参与三方可以投票决定资金的流向，而且每个人只能投一次票
        if ((caller == buyer || caller == seller || caller == arbiter) &&
            releaseAmount[caller] != true) {
                releaseAmount[caller] = true;
                releaseCount += 1;
        }

        //如果同意向卖家释放资金的人超过半数，就立刻将托管资金转入卖家账户
        if (releaseCount == 2) {
            seller.transfer(amount);
            fundsDisbursed = true;
        }
    }

    function refundAmountToBuyer(address caller) public {
        //如果资金已经流出，则终止函数执行
        require(!fundsDisbursed);
        //只有托管合约的参与三方可以投票决定资金的流向，而且每个人只能投一次票
        if ((caller == buyer || caller == seller || caller == arbiter) &&
            refundAmount[caller] != true) {
                refundAmount[caller] = true;
                refundCount += 1;
        }

        //如果同意向买家释放资金的人超过半数，就立刻将托管资金转入买家账户
        if (refundCount == 2) {
            buyer.transfer(amount);
            fundsDisbursed = true;
        }
    }
}
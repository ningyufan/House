pragma solidity ^0.4.13;

import "contracts/Escrow.sol";

contract EcommerceStore {
  enum ProductStatus { Open, Sold, Unsold }   //房子状态，（拍卖中，售出，未售）
  enum ProductCondition { New, Used }         //房子品相（新房，二手房）
  //买家信息
  struct Bid {
    address bidder;               //竞价者地址
    uint productId;               //房屋编号
    uint value;                   //支付的保证金
    bool revealed;                //是否揭示过出价
  }
  //房屋结构体
  struct Product {
    //房屋基本信息
    uint id;                       //房屋编号
    string name;                   //房屋名称
    string category;               //房屋类型
    string imageLink;              //房屋图片
    string descLink;               //房屋描述
    //拍卖相关信息
    uint auctionStartTime;         //拍卖开始时间
    uint auctionEndTime;           //拍卖截止时间
    uint startPrice;               //起拍价格
    address highestBidder;         //最高出价者
    uint highestBid;               //最高出价
    uint secondHighestBid;         //次高出价
    uint totalBids;                //投标人数
    //房屋状态
    ProductStatus status;           //房子销售状态：售出、未售
    ProductCondition condition;     //品相：新品、二手
    mapping (address => mapping (bytes32 => Bid)) bids;
  }

  //嵌套的mapping来区分不同卖家的房子：键为卖家的账户地址，值为另一个mapping —— 从房子编号到房子信息的映射。
  mapping (address => mapping(uint => Product)) stores;
  //房子编号到卖家账户地址的映射表
  mapping (uint => address) productIdInStore;
  //productIndex状态用来记录这个全局性的房子编号计数器
  uint public productIndex;
  mapping (uint => address) productEscrow;

  event NewProduct(
    uint _productId,
    string _name,
    string _category,
    string _imageLink,
    string _descLink,
    uint _auctionStartTime,
    uint _auctionEndTime,
    uint _startPrice,
    uint _productCondition);

  function EcommerceStore() public {
    productIndex = 0;
  }

  function addProductToStore(
    string _name,
    string _category,
    string _imageLink,
    string _descLink,
    uint _auctionStartTime,
    uint _auctionEndTime,
    uint _startPrice,
    uint _productCondition
    ) public {
      //拍卖截止时间应当晚于开始时间
      require (_auctionStartTime < _auctionEndTime);
      //房子编号计数器递增
      productIndex += 1;
      //构造Product结构变量
      Product memory product = Product(productIndex, _name, _category,  _imageLink, _descLink, _auctionStartTime, _auctionEndTime,
                      _startPrice, 0, 0, 0, 0, ProductStatus.Open, ProductCondition(_productCondition));
      //存入房子目录表
      stores[msg.sender][productIndex] = product;
      //保存房子反查表
      productIdInStore[productIndex] = msg.sender;

      NewProduct(productIndex, _name, _category, _imageLink, _descLink, _auctionStartTime, _auctionEndTime, _startPrice, _productCondition);
  }
  //问题，堆栈太深，只能返回10个变量  解决 ，再写一个方法返回剩余的字段
  function getProduct(uint _productId) view public
           returns (uint, string, string, string, string, uint, uint, uint, ProductStatus, ProductCondition) {
    //利用商品编号提取商品信息
    Product memory product = stores[productIdInStore[_productId]][_productId];
    //按照定义的先后顺序依次返回product结构各成员
    return (product.id, product.name, product.category, product.imageLink, product.descLink, product.auctionStartTime,
        product.auctionEndTime, product.startPrice, product.status, product.condition);
  }



  function bid(uint _productId, bytes32 _bid) payable public returns (bool) {
    Product storage product = stores[productIdInStore[_productId]][_productId];
    //当前还处于竞价有效期内
    require (now >= product.auctionStartTime);
    require (now <= product.auctionEndTime);
    //支付的保证金高于商品起拍价
    require (msg.value > product.startPrice);
    //竞价人首次递交该出价
    require (product.bids[msg.sender][_bid].bidder == 0);
    //保存出价信息
    product.bids[msg.sender][_bid] = Bid(msg.sender, _productId, msg.value, false);
    product.totalBids += 1;          //更新竞价参与人数
    return true;
  }

  function stringToUint(string s) pure private returns (uint) {
    bytes memory b = bytes(s);
    uint result = 0;

    for (uint i = 0; i < b.length; i++) {
      if (b[i] >= 48 && b[i] <= 57) {
        result = result * 10 + (uint(b[i]) - 48);
      }
    }
    return result;
  }

  function revealBid(uint _productId, string _amount, string _secret) public {
    Product storage product = stores[productIdInStore[_productId]][_productId];
    require (now > product.auctionEndTime);
    bytes32 sealedBid = sha3(_amount, _secret);
    Bid memory bidInfo = product.bids[msg.sender][sealedBid];

    require (bidInfo.bidder > 0);
    require (bidInfo.revealed == false);

    uint refund;
    uint amount = stringToUint(_amount);

    if(bidInfo.value < amount) {
      refund = bidInfo.value;
    } else {
      if (address(product.highestBidder) == 0) {
        product.highestBidder = msg.sender;
        product.highestBid = amount;
        product.secondHighestBid = product.startPrice;
        refund = bidInfo.value - amount;
      } else {
        if (amount > product.highestBid) {
          product.secondHighestBid = product.highestBid;
          product.highestBidder.transfer(product.highestBid);
          product.highestBidder = msg.sender;
          product.highestBid = amount;
          refund = bidInfo.value - amount;
        } else if (amount > product.secondHighestBid) {
          product.secondHighestBid = amount;
          refund = amount;
        } else {
          refund = amount;
        }
      }
    }

    product.bids[msg.sender][sealedBid].revealed = true;

    if (refund > 0) {
      msg.sender.transfer(refund);
    }
  }

  function highestBidderInfo(uint _productId) view public returns (address, uint, uint) {
    Product memory product = stores[productIdInStore[_productId]][_productId];
    return (product.highestBidder, product.highestBid, product.secondHighestBid);
  }

  function totalBids(uint _productId) view public returns (uint) {
    Product memory product = stores[productIdInStore[_productId]][_productId];
    return product.totalBids;
  }

  function finalizeAuction(uint _productId) public {
    //根据商品编号提取商品数据
    Product product = stores[productIdInStore[_productId]][_productId];
     //该商品的拍卖应该已经截止
    require(now > product.auctionEndTime);
     //该商品为首次拍卖，之前也没有流拍
    require(product.status == ProductStatus.Open);
    //方法的调用者是不是胜出的买家
    require(product.highestBidder != msg.sender);
    //调用者也不是卖家
    require(productIdInStore[_productId] != msg.sender);

    if (product.totalBids == 0) {       //没有人参与竞价，流拍
      product.status = ProductStatus.Unsold;     //将商品标记为”未售出“
    } else {
      //创建托管合约实例并按照次高出价将赢家资金转入托管合约
      Escrow escrow = (new Escrow).value(product.secondHighestBid)(_productId, product.highestBidder, productIdInStore[_productId], msg.sender);
      //记录托管合约实例的地址
      productEscrow[_productId] = address(escrow);
      //将商品标记为已售出
      product.status = ProductStatus.Sold;
      //计算赢家的保证金余额并原路返还
      uint refund = product.highestBid - product.secondHighestBid;
      product.highestBidder.transfer(refund);
    }
  }

  function releaseAmountToSeller(uint _productId) public {
    Escrow(productEscrow[_productId]).releaseAmountToSeller(msg.sender);
  }

  function refundAmountToBuyer(uint _productId) public {
    Escrow(productEscrow[_productId]).refundAmountToBuyer(msg.sender);
  }

  function escrowInfo(uint _productId) view public returns (address, address, address, bool, uint, uint) {
    return Escrow(productEscrow[_productId]).escrowInfo();
  }
}
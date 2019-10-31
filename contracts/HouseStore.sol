pragma solidity ^0.4.17;

contract HouseStore {
    struct Product {
        //房子基本信息
        uint id;                 //房子编号
        string name;             //房名
        uint room;               //房间数
        string category;         //房子类别
        uint balcony;            //阳台数量
        uint bathroom;           //卫浴数量
        string HouseAddress;     //房子地址
        uint floors;             //楼层
        uint price;              //月租
        string imageLink;        //房子图片链接地址
        string descLink;         //房子描述链接地址

        //房子出租信息
        uint StartTime;          //开始出租时间
        uint duration;           //租房时长

        HouseStatus status;       //房子销售状态：售出、未售
        HouseCondition condition; //品相：新品、二手

        mapping (address => mapping (bytes32 => Buyer)) buyers;
    }
    enum HouseStatus { Sold, Unsold }        //房子状态，（售出，未售）
    enum HouseCondition { New, Used }        //房子品相（新房，二手房）


    struct Buyer {
        address bidder;            //买家账户地址
        uint HouseId;              //房子编号
        uint value;                //支付的押金
        bool revealed;             //是否揭示过出价
    }

    //嵌套的mapping来区分不同卖家的房子：键为卖家的账户地址，值为另一个mapping —— 从房子编号到房子信息的映射：
    mapping (address => mapping(uint => Product)) stores;

    //房子编号到卖家账户地址的映射表
    mapping (uint => address ) HouseIdInStore;

    //productIndex状态用来记录这个全局性的房子编号计数器
    uint public HouseIndex;
    function houseId() public { HouseIndex = 0; }

    //参数为构建Product结构所需的基本信息。卖家将调用这个方法来上架商品
    function addHouseToStore(
        string _name,             //房名
        uint _room,               //房间数
        string _category,         //房子类别
        uint _balcony,            //阳台数量
        uint _bathroom,           //卫浴数量
        string _HouseAddress,     //房子地址
        uint _floors,             //楼层
        uint _price,              //月租
        string _imageLink,        //房子图片链接地址
        string _descLink,         //房子描述链接地址
        uint _HouseCondition      //品相：新品、二手
    ) public {
        //房子编号计数器递增
        HouseIndex += 1;
        //构造Product结构变量
        Product memory product = Product(HouseIndex, _name, _room, _category, _balcony, _bathroom,
                            _HouseAddress, _floors, _price, _imageLink, _descLink, 0, 0,
                            HouseStatus.Unsold, HouseCondition(_HouseCondition));
        //存入房子目录表
        stores[msg.sender][HouseIndex] = product;
        //保存房子反查表
        HouseIdInStore[HouseIndex] = msg.sender;
    }

    //问题，堆栈太深，只能返回10个变量
    function getProduct( uint _productId) view public returns (uint, string, uint, string, uint, uint, string,
                                                                uint, uint, string
                                                                ) {
        //利用商品编号提取商品信息
        Product memory product = stores[HouseIdInStore[_productId]][_productId];
        //按照定义的先后顺序依次返回product结构各成员
        return (product.id, product.name, product.room, product.category,product.balcony,
            product.bathroom, product.HouseAddress, product.floors, product.price,product.imageLink);
    }

    function bid(uint _productId, bytes32 _bid) payable public returns (bool) {
        //利用商品编号提取商品数据
        Product storage product = stores[HouseIdInStore[_productId]][_productId];
        //当前还处于竞价有效期内
        require (now >= product.auctionStartTime);
        require (now <= product.auctionEndTime);
        //支付的保证金高于商品起拍价
        require (msg.value > product.startPrice);
        //竞价人首次递交该出价
        require (product.bids[msg.sender][_bid].bidder == 0);
        //保存出价信息
        product.bids[msg.sender][_bid] = Bid(msg.sender, _productId, msg.value, false);
        return true;
    }
}


//命令：
//>truffle compile     //编译
//>ganache-cli         //节点仿真器
//>truffle migrate     //执行迁移脚本：
//truffle console      //进入truffle控制台

//先代表卖家添加一个商品。现在先随便设定一下图片和描述链接，在实现IPFS的 相关功能后，再来改进这一点：

//truffle(development)>  m_price = web3.toWei(1, 'ether');                  //使用web3.toWei()方法将1个以太转换为以wei为单位的面值
//truffle(development)>  current_time = Math.round(new Date() / 1000);    // 然后获取当前时间值并转换为以秒为单位的数值
//truffle(development)>  HouseStore.deployed().then(
    //function(inst) {
        //inst.addHouseToStore('碧桂园', 2, 'apartment', 1, 1, '玉林市教育路1号', 8, m_price, 'imagelink', 'desclink',
        // 0
        //).then(
            //function(f) {
               //console.log(f)
            //})
    //});
//调用电商合约实例的addProductStore() 方法将一个商品添加到合约的商品目录中。


// 测试商品信息查看功能, 代表买家，来查看指定编号商品的信息：

// truffle(development)>  HouseStore.deployed().then(function(inst) {inst.getProduct.call(1).then(function(f) {console.log(f)})})






// HouseStore.deployed().then(function(inst) { inst.addHouseToStore('碧桂园', 2, 'apartment', 1, 1, '玉林市教育路1号', 8, m_price, 'imagelink', 'desclink',9).then(function(f){console.log(f)})});
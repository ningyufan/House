安装开发环境
truffle 4.1.3
ganache-cli 6.0.3
go-ipfs 0.4.13
mongoose  5.0.11

运行步骤
1.解压文件，进入文件，创建mongod文件夹
2.打开终端进入文件目录执行命令：npm install
3.启动节点仿真器ganache-cli;打开终端1进入文件目录执行命令：ganache-cli
4.启动ipfs;打开终端2进入文件目录执行命令：ipfs daemon
5.启动MongoDB；打开终端3进入文件目录执行命令：mongod --dbpath ./mongod
6.编译合约代码；打开终端4进入文件目录执行命令：truffle compile
                            执行迁移脚本：truffle migrate --reset
                            打包合约：webpack
                            启动服务端：node server.js
7.运行脚本添加初始商品数据，打开终端5进入文件目录执行命令:truffle exec ./seed.js
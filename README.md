# ZJU-blockchain-hw2

## 如何运行

1. 在本地启动ganache应用。

2. 在 `./contracts` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```

3. 在 `./contracts` 中编译合约，运行如下的命令：
    ```bash
    npx hardhat compile
    ```

4. 在 `./contracts` 中部署合约，运行如下的命令：

    ```bash
    注意在部署合约前先修改hardhat.config.ts文件，将其中的私钥替换为本地ganache上私钥
    npx hardhat run scripts/deploy.ts --network ganache
    ```

5. 根据部署地址更新frontend\src\utils\contract-addresses.json文件中合约的地址

6. 在 `./frontend` 中安装需要的依赖，运行如下的命令：

    ```bash
    npm install
    npm install web3
    npm install antd
    npm install @ant-design/pro-table
    ```

7. 在 `./frontend` 中启动前端程序，运行如下的命令：

    ```bash
    npm run start
    ```

8. 运行meshmask，导入ganache上私钥

9. git环境可能配置不全，可以解压hw2.zip获得源码与环境

## 功能实现分析

1. 每个学生初始可以领取一些通证积分（100）。

   实现：通过继承ERC20，实现airdrop函数发放积分。

2. 使用10通证积分，发起关于该社团进行活动或制定规则的提案。

   实现：通过智能合约中的proposals数组实现提案数据的储存，并调用ERC20中transfer函数扣除积分。

3. 提案发起后一定支出时间（由提案人设置，单位为秒）内，使用10通证积分可以对提案进行投票（赞成或反对，限制投票次数为3次），投票行为被记录到区块链上，并调用ERC20中transfer函数扣除积分。

   实现：通过智能合约中的votes数组实现投票数据的储存。

4. 提案投票时间截止后，赞成数大于反对数的提案通过，提案发起者通过提案数加1

   实现：通过智能合约中checkProposal函数检查每个提案是否结束，并判断是否通过。所有链上存储的提案都通过table展现在网页上。

5. (Bonus）发起提案并通过3次的学生，可以领取社团颁发的纪念品（ERC721）

   实现：在链上存储每个发起过提案的人提案的通过次数。通过次数大于等于3次，可以在前端点击领取纪念品按钮获得奖励（通过调用继承ERC721合约中的awardItem函数实现）

## 项目运行截图

![image-20221107211021521](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20221107211021521.png)

领取积分

![image-20221107211222170](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20221107211222170.png)



提交提案

![image-20221107211322611](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20221107211322611.png)

测试提案展示

![image-20221107211532773](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20221107211532773.png)

赞成投票

![image-20221107211617388](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20221107211617388.png)

投票展示

![image-20221107211730738](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20221107211730738.png)

检查提案

![image-20221107211752731](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20221107211752731.png)

提案状态被修改

![image-20221107211826585](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20221107211826585.png)

领取纪念品

![image-20221107211844795](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20221107211844795.png)

## 参考内容

课程的参考Demo：[DEMOs](https://github.com/LBruyne/blockchain-course-demos)。

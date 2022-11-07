import Addresses from './contract-addresses.json'
import StudentSocietyDAO from './abis/StudentSocietyDAO.json'
import StudentERC20 from './abis/StudentERC20.json'
import GameItem from './abis/GameItem.json'
const Web3 = require('web3');

// @ts-ignore
// 创建web3实例
// 可以阅读获取更多信息https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
let web3 = new Web3(window.web3.currentProvider)

// 修改地址为部署的合约地址
const StudentSocietyDAOAddress = Addresses.StudentSocietyDAO
const StudentSocietyDAOABI = StudentSocietyDAO.abi
const StudentERC20Address = Addresses.StudentERC20
const StudentERC20ABI = StudentERC20.abi
const GameItemAddress = Addresses.GameItem
const GameItemABI = GameItem.abi
// 获取合约实例
const StudentSocietyDAOContract = new web3.eth.Contract(StudentSocietyDAOABI, StudentSocietyDAOAddress);
const StudentERC20Contract = new web3.eth.Contract(StudentERC20ABI, StudentERC20Address);
const GameItemContract = new web3.eth.Contract(GameItemABI, GameItemAddress)
// 导出web3实例和其它部署的合约
export { web3, StudentSocietyDAOContract, StudentERC20Contract, GameItemContract}
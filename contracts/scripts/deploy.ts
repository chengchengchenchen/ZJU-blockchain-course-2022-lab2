import { ethers } from "hardhat";

async function main() {
  const StudentSocietyDAO = await ethers.getContractFactory("StudentSocietyDAO");
  const studentSocietyDAO = await StudentSocietyDAO.deploy();
  await studentSocietyDAO.deployed();

    console.log(`StudentSocietyDAO deployed to ${studentSocietyDAO.address}`);

    const Erc20 = await ethers.getContractFactory("StudentERC20");
    const erc20 = await Erc20.deploy("ZJUToken", "ZJUTokenSymbol");
    await erc20.deployed();

    console.log(`ERC20 deployed to ${erc20.address}`);

    const test = await studentSocietyDAO.studentERC20()
    console.log(`erc20 contract has been deployed successfully in ${test}`)

    const Erc721 = await ethers.getContractFactory("GameItem");
    const erc721 = await Erc721.deploy();
    await erc721.deployed();

    console.log(`ERC721 deployed to ${erc721.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

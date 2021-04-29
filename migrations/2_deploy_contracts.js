module.exports = async function(deployer) {

  const Token = artifacts.require("Token")
  const master_swap_artifact= artifacts.require("master_swap")
  // Deploy Token
  await deployer.deploy(Token)
  const token = await Token.deployed()

  // Deploy master_swap
  await deployer.deploy(master_swap_artifact, token.address)
  const master_swap = await master_swap_artifact.deployed()

  // Transfer all tokens to master_swap (1 million)
  await token.transfer(master_swap.address, '1000000000000000000000000')
};
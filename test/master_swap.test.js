const Token = artifacts.require("Token")
const MasterSwap = artifacts.require("master_swap")

require ("chai")
	.use(require("chai-as-promised"))
	.should()

function tokens(n) {
	return web3.utils.toWei(n,"ether");	
}

contract('master_swap', ([deployer, investor]) => {
	let tokenContract, masterSwapContract

	before(async () => {
		tokenContract = await Token.new()
		masterSwapContract = await MasterSwap.new(tokenContract.address)
		// Transfer all tokens to MasterSwap(1 million)
		await tokenContract.transfer(masterSwapContract.address, tokens("1000000"))
	})

	describe("Token deployment", async () => {
		it("contract has a name", async () => {
			const name = await tokenContract.name()
			assert.equal(name,"Block-Charity")
		})
	})

	describe("master_swap deployment", async () => {
		it("contract has a name", async () => {
			const name = await masterSwapContract.name()
			assert.equal(name,"master_swap Instant Exchange")
		})

		it("contract has tokens", async ()=> {
			let balance = await tokenContract.balanceOf(masterSwapContract.address)
			assert.equal(balance.toString(), tokens("1000000"))	
		})
	})

	describe("buyTokens()", async () => {
		it("Allows user to instantly purchase tokens from masterSwapContract for a fixed price", async() => {
			await masterSwapContract.buyTokens({ from: investor, value: web3.utils.toWei("1","ether")})
		})
	})

})




























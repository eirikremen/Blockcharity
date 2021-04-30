const Token = artifacts.require("Token")
const MasterSwap = artifacts.require("master_swap")

require ("chai")
	.use(require("chai-as-promised"))
	.should()

function tokens(n) {
	return web3.utils.toWei(n,"ether");	
}

contract('master_swap', ([deployer, investor ]) => {
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
		let result

		before(async () => {
			//Purchase tokens before each example
			result = await masterSwapContract.buyTokens({ from: investor, value: web3.utils.toWei("1","ether")})
	})

		it("Allows user to instantly purchase tokens from masterSwapContract for a fixed price", async() => {
			//Check investor recive token balance after purchase
			let investorBalance = await tokenContract.balanceOf(investor)
			assert.equal(investorBalance.toString(), tokens("100"))			
		
			//Check MasterSwap balance after purchase
			let MasterSwapBalance
			MasterSwapBalance = await tokenContract.balanceOf(masterSwapContract.address)
			assert.equal(MasterSwapBalance.toString(), tokens("999900"))
			MasterSwapBalance = await web3.eth.getBalance(masterSwapContract.address)
			assert.equal(MasterSwapBalance.toString(), web3.utils.toWei("1", "ether"))
		
			const event = result.logs[0].args
			assert.equal(event.account, investor)
			assert.equal(event.token, tokenContract.address)
			assert.equal(event.amount.toString(),tokens("100").toString())
			assert.equal(event.rate.toString(), "100")
		})
	})


	describe("sellTokens()", async () => {
		let result

		before(async () => {
			// Investor must approve tokens before the purchase
			await tokenContract.approve(masterSwapContract.address, tokens("100"), { from: investor })
			//Investor sell tokens
			result = await masterSwapContract.sellTokens(tokens("100"), { from: investor })
		})

		it("Allows user to instantly sell tokens to masterSwapContract for a fixed price", async() => {
			//Check investor recive token balance after sell
			let investorBalance = await tokenContract.balanceOf(investor)
			assert.equal(investorBalance.toString(), tokens("0"))			
		
			//Check MasterSwap balance after sell
			let MasterSwapBalance
			MasterSwapBalance = await tokenContract.balanceOf(masterSwapContract.address)
			assert.equal(MasterSwapBalance.toString(), tokens("1000000"))
			MasterSwapBalance = await web3.eth.getBalance(masterSwapContract.address)
			assert.equal(MasterSwapBalance.toString(), web3.utils.toWei("0", "ether"))
		})
	})

})




























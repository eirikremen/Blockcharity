pragma solidity ^0.5.0;

import "./Token.sol";

contract master_swap {
 string public name = "master_swap Instant Exchange";
 Token public token;
 uint public rate = 100;

 event TokenPurchased(
 	address account,
 	address token,
 	uint amount,
 	uint rate
 );
 
  event TokenSold(
 	address account,
 	address token,
 	uint amount,
 	uint rate
 );
	constructor(Token _token) public{
		token = _token;
	}
 
 function buyTokens() public payable {
 	// Calculate the number of tokens to buy
 	uint tokenAmount = msg.value * rate;
 	
 	//Require that masterswap has enough tokens
 	require(token.balanceOf(address(this)) >= tokenAmount);

 	//Transfer tokens to the user
 	token.transfer(msg.sender, tokenAmount); 
 
 	//Emit an event
 	emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
 }

 function sellTokens(uint _amount) public {
 	//User can´t sell more tokens than they have
 	require(token.balanceOf(msg.sender) >= _amount);
 	

 	//Calculate the amount of Ether to redeem
 	uint etherAmount = _amount / rate;

 	//Require that masterswap has enough Ether
 	require(address(this).balance >= etherAmount);
 	
 	//Perform the sale
 	token.transferFrom(msg.sender, address(this), _amount);
 	msg.sender.transfer(etherAmount);

 	//Emit an event
 	emit TokenSold(msg.sender, address(token), _amount, rate);
 }

}












 
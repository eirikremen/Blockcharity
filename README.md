# Blockcharity

First part

Download the project:
1. git clone repository
2. cd Blockcharity
3. npm install




Second part: Setting up

Start by installing Node
// Type the following  command into the terminal
$ node -v

Next, download Ganache : 
https://www.trufflesuite.com/ganache


After Ganache is downloaded, open the terminal an install Truffle

$ npm install -g truffle

MetaMask is needed for this project. Go ahead and download it:
https://metamask.io/download

Run the web app locally connected to a local blockchain using Ganache.
Lets start the webserver next.

$npm run start
// The new browser should pop up on your localhost: 3000

Now lets open the the terminal again and open the Blockcharity project to migrate the contracts.

$ truffle migrate

We can now interact with the smart contracts with the truffle console.

$ truffle console

Finally we connect the smart contracts by rerunning the migrations

$ truffle migrate --reset

The next thing you will need is a way to access your running blockchain. 
The project is tested with an application called MetaMask.io. 
This is a browser extension that connects our JavaScript code to our 
Solidity contracts by injecting a framework called Web3.js. 
Add this extension to your browser and make sure to switch the Metamask network to Localhost 8545. 
This is the server where the Ethereum blockchain is hosted. The application will not function properly if you are connected to a different network.

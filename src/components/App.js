import React, { Component } from 'react';
import Web3 from "web3"
import Token from "../abis/Token.json"
import master_swap from "../abis/master_swap.json"
import NavBar from "./NavBar"
import Main from "./Main"
import './App.css'

class App extends Component {

async componentWillMount() {
  await this.loadWeb3()
  await this.loadBlockchainData()
}

async loadBlockchainData() {
  const web3= window.web3

  const accounts = await web3.eth.getAccounts()
  this.setState({ account: accounts[0] })

  const ethBalance = await web3.eth.getBalance(this.state.account)
  this.setState({ ethBalance })
  
  // Load Token
    const networkId =  await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ token })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState({ tokenBalance: tokenBalance.toString() })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }


   // Load master_swap
    const master_swap_artifactData = master_swap.networks[networkId]
    if(master_swap) {
      const master_swapartifact = new web3.eth.Contract(master_swap.abi, master_swap_artifactData.address)
      this.setState({ master_swapartifact })
    } else {
      window.alert('master_swap contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }


async loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()

    }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }  
  }

   buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.master_swapartifact.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.master_swapartifact.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.master_swapartifact.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {  
      accounts: "",
      token: {},
      master_swap: {}, 
      ethBalance: "0",
      tokenBalance: "0",
      loading: true     
    }
  }

    render() {
      let content
      if(this.state.loading) {
        content = <p id="loader" className="text-center"> Loading...</p>
      } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />
    }

    return (
      <div>
        <NavBar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
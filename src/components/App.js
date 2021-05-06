import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Color from '../abis/Color.json'

class App extends Component {
//Connect App to Blockchain using web3.js
  
async componentWillMount() {
  await this.loadWeb3()
  await this.loadBlockchainData()
}

async loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
}

async loadBlockchainData() {
  const web3 = window.web3
  // Load account
  const accounts = await web3.eth.getAccounts()
  this.setState({ account: accounts[0] })

  const networkId = await web3.eth.net.getId()
  const networkData = Color.networks[networkId]
  if(networkData) {
    const abi = Color.abi
    const address = networkData.address
    const contract = new web3.eth.Contract(abi, address)
    this.setState({ contract })
    const totalSupply = await contract.methods.totalSupply().call()
    this.setState({ totalSupply })
    // Load Colors
    for (var i = 1; i <= totalSupply; i++) {
      const color = await contract.methods.colors(i - 1).call()
      this.setState({
        colors: [...this.state.colors, color]
      })
    }
  } else {
    window.alert('Smart contract not deployed to detected network.')
  }
}

mint = (color) => {
  this.state.contract.methods.mint(color).send({ from: this.state.account })
  .once('receipt', (receipt) => {
    this.setState({
      colors: [...this.state.colors, color]
    })
  })
}

constructor(props) {
  super(props)
  this.state = {
    account: '',
    contract: null,
    totalSupply: 0,
    colors: []
  }
}
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Token
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* <img src={logo} className="App-logo" alt="logo" /> */}
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

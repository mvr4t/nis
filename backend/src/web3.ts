import Web3 from "web3";
import data from "../contracts/Election.json";

export const web3 = new Web3("https://sepolia.infura.io/v3/359462cee46d4736b95f0ad191fd6385");

const provider = new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/359462cee46d4736b95f0ad191fd6385");
const   contract = require("@truffle/contract");
  
web3.eth.net.isListening()
  .then(() => {
    console.log('Connected to Infura via Metamask');
  })
  .catch((error) => {
    console.error('Error connecting to Infura:', error);
  });
  
const ElectionContract = contract(data);

ElectionContract.setProvider(provider);

export default ElectionContract;
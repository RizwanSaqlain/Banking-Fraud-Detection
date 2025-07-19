// backend/blockchain.js
import Web3 from 'web3';

// Connect to Ganache or testnet (Infura, Alchemy)
const web3 = new Web3('http://localhost:8545'); // Or use infura URL

// Use an empty ABI to disable blockchain features safely
const contractABI = [];
const contractAddress = '0x1234567890abcdef1234567890abcdef12345678'; // Example

// Load the contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

export { web3, contract };

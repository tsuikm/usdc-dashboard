import { abi } from '../utils/testTokenABI.js';
import Web3 from 'web3';
import { TEST_TOKEN_CONTRACT_ADDRESS, TEST_TOKEN_OWNER_ADDRESS } from '../utils/constants.js';

console.log("line 5");
const web3 = new Web3(Web3.givenProvider);
console.log("line 7");
const contract = new web3.eth.Contract(abi, TEST_TOKEN_CONTRACT_ADDRESS);
console.log("line 9");

const addMinter = async address => {
    console.log("line 12");
    await contract.methods.configureMinter(address, 5000).call();
    console.log("line 14");
    console.log(contract.methods.isMinter(address));
}

const pause = async () => {
    await contract.methods.pause().call();
}

const unpause = async () => {
    await contract.methods.unpause().call();
}

addMinter(TEST_TOKEN_OWNER_ADDRESS);
//addMinter();



import { abi } from '@/constants/testTokenABI';
import Web3 from web3;
import { TEST_TOKEN_CONTRACT_ADDRESS, TEST_TOKEN_OWNER_ADDRESS } from '../utils/constants';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, TEST_TOKEN_CONTRACT_ADDRESS);

const addMinter = async address => {
    await contract.methods.configureMinter(address, 5000).call();
    return contract.methods.isMinter(address);
}

const pause = async => {
    await contract.methods.pause().call();
}

const unpause = async => {
    await contract.methods.unpause().call();
}

return addMinter(TEST_TOKEN_OWNER_ADDRESS);
//addMinter();



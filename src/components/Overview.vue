<template>
  <div>
    <div class="summaryCards">
      <div class="leftSummary">
        <Address
          :wallet-address="walletAddress"
          :is-contract="this.isContract"
          :is-blacklisted="isBlacklisted"
        />
        <BalanceCard
          :usdc-balance="this.balance"
          :minter="this.minter"
          :pauser="this.pauser"
          :owner="this.owner"
        />
      </div>
      <TotalSupply
        :usdc-balance="this.balance"
        :total-supply="this.totalSupply"
      />
    </div>
  </div>
</template>

<script>
import {
  USDC_CONTRACT_ADDRESS,
  WEB3_BALANCEOF_ADDRESS_LENGTH,
} from '@/utils/constants';
import Address from './Address';
import BalanceCard from './BalanceCard';
import TotalSupply from '@/components/TotalSupply';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';
import { abi } from '@/utils/web3abi';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export async function getDecimals() {
  return await contract.methods.decimals().call();
}

export async function getBalance(address) {
  const balance = await contract.methods
    .balanceOf(padHex(address, WEB3_BALANCEOF_ADDRESS_LENGTH))
    .call();
  const decimals = await getDecimals();

  return balance / (10 ** decimals);
}

export async function getTotalSupply() {
  const decimals = await contract.methods.decimals().call();
  return await contract.methods.totalSupply().call() / (10 ** decimals);
}

export default {
  components: {
    BalanceCard,
    TotalSupply,
    Address,
  },
  props: {
    walletAddress: String,
  },
  data() {
    return {
      balance: null,
      isBlacklisted: false,
      totalSupply: null,
      minter: null,
      pauser: null,
      owner: null,
      isContract: null,
    };
  },
  created: function () {
    this.lookupBalance();
    this.lookupBlacklisted();
  },
  updated: function () {
    this.update();
  },
  methods: {
    async lookupBalance() {
      if (this.walletAddress === '') {
        return;
      }

      this.balance = await getBalance(this.walletAddress);
    },
    async lookupBlacklisted() {
      if (this.walletAddress === '') {
        return;
      }

      this.isBlacklisted = await contract.methods
        .isBlacklisted(
          padHex(this.walletAddress, WEB3_BALANCEOF_ADDRESS_LENGTH),
        )
        .call();
    },
    convertToUSD() {
      this.usdValue = this.balance * this.conversionRate;
    },
    async getTotalSupply() {
      this.totalSupply = await getTotalSupply();
    },
    async checkIsMinter() {
      this.minter = await contract.methods.isMinter(this.walletAddress).call();
    },
    async checkIsPauser() {
      const pauserAddress = await contract.methods.pauser().call();
      this.pauser = pauserAddress === this.walletAddress;
    },
    async checkIsOwner() {
      const owner = await contract.methods.owner().call();
      const ownerAddress = padHex(owner, WEB3_BALANCEOF_ADDRESS_LENGTH);
      this.owner = ownerAddress === this.walletAddress;
    },
    async checkIsContract() {
      const address = await web3.eth.getCode(this.walletAddress);
      this.isContract = address !== '0x';
    },
    update() {
      this.checkIsContract();
      this.getTotalSupply();
      this.checkIsMinter();
      this.checkIsPauser();
      this.checkIsOwner();
    },
  },
};
</script>

<style scoped>
.summaryCards {
  display: flex;
  justify-content: space-between;
  padding: 75px;
}
</style>

<template>
  <div>
    <div>Address: {{ walletAddress }}</div>
    <div>Balance: {{ this.balance }}</div>
    <BalanceCard
      :usdcBalance="this.balance"
      :usdValue="this.usdValue"
      :conversionRate="this.conversionRate"
    />
  </div>
</template>

<script>
import Web3 from "web3";
import { padHex } from "@/utils/utils";
import {
  USDC_CONTRACT_ADDRESS,
  WEB3_BALANCEOF_ADDRESS_LENGTH,
} from "@/utils/constants";
import BalanceCard from "./BalanceCard";
const web3 = new Web3(Web3.givenProvider);

const abi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export async function getBalance(address) {
  const balance = await contract.methods.balanceOf(padHex(address, WEB3_BALANCEOF_ADDRESS_LENGTH)).call()
  const decimals = await contract.methods.decimals().call();

  return balance / (10 ** decimals);
}

export default {
  components: {
    BalanceCard,
  },
  data() {
    return {
      balance: null,
      usdValue: null,
      conversionRate: null,
    };
  },
  props: {
    walletAddress: String,
  },
  created: async function () {
    await this.lookupBalance();
  },
  updated: function () {
    this.$nextTick(this.convertToUSD());
  },
  mounted: function () {
    require("axios")
      .get("https://api.coinbase.com/v2/exchange-rates?currency=USD")
      .then(
        (response) => (this.conversionRate = response.data.data.rates.USDC)
      );
  },
  methods: {
    async lookupBalance() {
      if (this.walletAddress === "") {
        return;
      }

      this.balance = await getBalance(this.walletAddress);
    },
    convertToUSD() {
      this.usdValue = this.balance * this.conversionRate;
    },
  },
};
</script>

<template>
  <div>
    <div>Address: {{ walletAddress }}</div>
    <div>Balance: {{ this.balance }}</div>
    <div class="summaryCards">
      <BalanceCard
        :usdcBalance="this.balance"
        :usdValue="this.usdValue"
        :conversionRate="this.conversionRate"
      />
      <TotalSupply :usdcBalance="this.balance" :totalSupply="this.totalSupply"/>
    </div>
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
import TotalSupply from "./TotalSupply";
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
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  components: {
    BalanceCard,
    TotalSupply,
  },
  data() {
    return {
      balance: null,
      usdValue: null,
      conversionRate: null,
      totalSupply: null,
    };
  },
  props: {
    walletAddress: String,
  },
  created: function () {
    this.lookupBalance();
  },
  updated: function () {
    this.$nextTick(this.convertToUSD());
    this.$nextTick(this.getTotalSupply());
  },
  mounted: function () {
    require("axios")
      .get("https://api.coinbase.com/v2/exchange-rates?currency=USD")
      .then(
        (response) => (this.conversionRate = response.data.data.rates.USDC)
      );
  },
  methods: {
    lookupBalance() {
      if (this.walletAddress === "") {
        return;
      }

      contract.methods
        .balanceOf(padHex(this.walletAddress, WEB3_BALANCEOF_ADDRESS_LENGTH))
        .call((error, balance) => {
          contract.methods.decimals().call((error, decimals) => {
            this.balance = balance / 10 ** decimals;
          });
        });
    },
    convertToUSD() {
      this.usdValue = this.balance * this.conversionRate;
    },
    getTotalSupply() {
      contract.methods.totalSupply().call((error, totalSupply) => {
      this.totalSupply = totalSupply;
      });
    }
  },
};
</script>

<style scoped>
.summaryCards {
  display: flex;
  justify-content: space-between;
  padding: 50px;
}
</style>

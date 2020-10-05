<template>
  <div>
    <div>
      <md-icon v-if="isBlacklisted">block</md-icon>
    </div>
    <div class="summaryCards">
      <div class="leftSummary">
        <Address :walletAddress="walletAddress" :isContract="isContract" />
        <BalanceCard
          :usdcBalance="this.balance"
          :usdValue="this.usdValue"
          :conversionRate="this.conversionRate"
          :minter="minter"
          :pauser="pauser"
          :owner="owner"
        />
      </div>
      <TotalSupply :usdcBalance="this.balance" :totalSupply="this.totalSupply" />
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import { padHex } from "@/utils/utils";
import {
  USDC_CONTRACT_ADDRESS,
  WEB3_BALANCEOF_ADDRESS_LENGTH
} from "@/utils/constants";
import BalanceCard from "./BalanceCard";
import TotalSupply from "@/components/TotalSupply";
import Address from "./Address";
const web3 = new Web3(Web3.givenProvider);

const abi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "isMinter",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "pauser",
    outputs: [{ name: "", type: "address" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "isContract",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  },
  {
    inputs: [{ name: "_account", type: "address" }],
    name: "isBlacklisted",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  }
];
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  components: {
    BalanceCard,
    TotalSupply,
    Address
  },
  data() {
    return {
      balance: null,
      isBlacklisted: false,
      usdValue: null,
      conversionRate: null,
      totalSupply: null,
      minter: null,
      pauser: null,
      owner: null,
      isContract: null
    };
  },
  props: {
    walletAddress: String
  },
  created: function() {
    this.lookupBalance();
    this.lookupBlacklisted();
  },
  updated: function() {
    this.$nextTick(this.checkIsContract());
    this.$nextTick(this.convertToUSD());
    this.$nextTick(this.getTotalSupply());
    this.$nextTick(this.checkIsMinter());
    this.$nextTick(this.checkIsPauser());
    this.$nextTick(this.checkIsOwner());
  },
  mounted: async function() {
    const response = await require("axios").get(
      "https://api.coinbase.com/v2/exchange-rates?currency=USD"
    );
    this.conversionRate = response.data.data.rates.USDC;
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
    lookupBlacklisted() {
      if (this.walletAddress === "") {
        return;
      }

      contract.methods
        .isBlacklisted(
          padHex(this.walletAddress, WEB3_BALANCEOF_ADDRESS_LENGTH)
        )
        .call((error, isBlacklisted) => {
          this.isBlacklisted = isBlacklisted;
        });
    },
    convertToUSD() {
      this.usdValue = this.balance * this.conversionRate;
    },
    getTotalSupply() {
      contract.methods.totalSupply().call((error, totalSupply) => {
        this.totalSupply = totalSupply;
      });
    },
    checkIsMinter() {
      contract.methods.isMinter(this.walletAddress).call((error, minter) => {
        this.minter = minter;
      });
    },
    checkIsPauser() {
      contract.methods.pauser().call((error, pauser) => {
        var pauserAddress = pauser;
        if (pauserAddress === this.walletAddress) {
          this.pauser = true;
        } else {
          this.pauser = false;
        }
      });
    },
    checkIsOwner() {
      contract.methods.owner().call((error, owner) => {
        var ownerAddress = padHex(owner, WEB3_BALANCEOF_ADDRESS_LENGTH);
        if (ownerAddress === this.walletAddress) {
          this.owner = true;
        } else {
          this.owner = false;
        }
      });
    },
    checkIsContract() {
      web3.eth.getCode(this.walletAddress).then(addressType => {
        var address = addressType;
        if (address !== "0x") {
          this.isContract = true;
        } else {
          this.isContract = false;
        }
      });
    }
    // async fetchRate(url) {
    //   try {
    //     const response = await fetch(url);
    //     data = response.data["rates"];
    //     response.text().then((data) => {
    //       console.log("data", data)
    //     })
    //     console.log("object", response.text());
    //     this.conversionRate = response[data].text();
    //     console.log("conv rate", this.conversionRate);
    //   } catch (err) {
    //     console.log('fetch failed', err);
    //   }
    // }
  }
};
</script>

<style scoped>
.summaryCards {
  display: flex;
  justify-content: space-between;
  padding: 50px;
}
</style>

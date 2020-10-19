<template>
  <div>
    <div class="summaryCards">
      <div class="leftSummary">
        <Address
          :walletAddress="walletAddress"
          :isContract="this.isContract"
          :isBlacklisted="isBlacklisted"
        />
        <BalanceCard
          :usdcBalance="this.balance"
          :minter="this.minter"
          :pauser="this.pauser"
          :owner="this.owner"
        />
      </div>
      <TotalSupply
        :usdcBalance="this.balance"
        :totalSupply="this.totalSupply"
      />
    </div>
    <div> From the 10000 latest transactions, this minter has minted {{ this.mintedAmount }}
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import { padHex } from "@/utils/utils";
import {
  USDC_CONTRACT_ADDRESS,
  WEB3_BALANCEOF_ADDRESS_LENGTH,
  TRANSACTION_TOPIC,
  WEB3_GET_LOGS_ADDRESS_LENGTH,
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
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "isMinter",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "pauser",
    outputs: [{ name: "", type: "address" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "isContract",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    inputs: [{ name: "_account", type: "address" }],
    name: "isBlacklisted",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "minter", type: "address" },
             { indexed: true, internalType: "address", name: "to", type: "address"},
             { indexed: false, internalType: "uint256", name: "amount", type: "uint256"}],
    name: "Mint",
    type: "event",
  }
];
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export const getMintEvent = async () => {
  const mintEvents = await contract.getPastEvents("Mint", {
    fromBlock: 7990000,
    toBlock: 8000000,
    topics: [null, null, null],
    filter: {
      minter: '0xE0E70f654975171e56f3A06ce67a46C653dd3EF4'
    }
  })
  console.log(mintEvents)

  // contract.events.({
  // })
  // .on('data', (event) => {
  //   console.log(event);
  // })
  // .on('error', console.error);
  
  // const mintEvents = await contract.getPastEvents("Mint",
  // {
  //   fromBlock: 7700000,
  //   toBlock: 7701000
  // }).then(events => console.log(events)).catch((err) => console.error(err));
  //
  // const mintEvents = contract.events.Mint({ 
  //   filter: { minter: this.walletAddress }, 
  //   fromBlock: startBlock})
  //   .on('data', (function(event) {
  //     let total = this.state.mintedAmount;
  //     total = total.plus(event.returnValues.amount);
  //     this.mintedAmount = total;
  //   }))
}

export async function getBalance(address) {
  const balance = await contract.methods
    .balanceOf(padHex(address, WEB3_BALANCEOF_ADDRESS_LENGTH))
    .call();
  const decimals = await contract.methods.decimals().call();

  return balance / 10 ** decimals;
}

export default {
  components: {
    BalanceCard,
    TotalSupply,
    Address,
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
      mintedAmount: null,
    };
  },
  props: {
    walletAddress: String,
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
      if (this.walletAddress === "") {
        return;
      }

      this.balance = await getBalance(this.walletAddress);
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
      web3.eth.getCode(this.walletAddress).then((addressType) => {
        var address = addressType;
        if (address !== "0x") {
          this.isContract = true;
        } else {
          this.isContract = false;
        }
      });
    },
    // getMinterMinted() {
    //   getMintEvent();
    // },
    async getFilteredMintEvents() {
      if (!this.minter) {
        console.log("currently not a minter");
        return;
      }
      let address = this.walletAddress;
      if (!address || address.length === 0) return;

      address = padHex(address, WEB3_GET_LOGS_ADDRESS_LENGTH);

      let mintEvents = null;
      try {
        mintEvents = await contract.getPastEvents("Mint", {
          fromBlock: 0,
          toBlock: 'latest',
          topics: [null, null, null],
          filter: { minter: this.walletAddress }
        });
      } catch (e) {
        mintEvents = null;
      }

      if (mintEvents !== null) {
        this.mintedAmount += parseInt(mintEvents.returnValues.amount);
        return;
      }

      console.log("past first null check");

      let range = [0, await web3.eth.getBlockNumber()];
      let fromBlock = Math.floor((range[0] + range[1]) / 2);
      try {
        mintEvents = await contract.getPastEvents("Mint", {
          fromBlock: fromBlock,
          toBlock: 'latest',
          topics: [null, null, null],
          filter: { minter: this.walletAddress }
        });
      } catch (e) {
        mintEvents = null;
        console.log("errors again in the while");
      }
      console.log("mint events in second mintevent check", mintEvents);

      while (
        mintEvents === null ||
        mintEvents.length < 10000
      ) {
        console.log('inside while statement');
        if (mintEvents === null) {
          // Still too many mint events
          console.log('resetting 0');
          range[0] = fromBlock;
        } else {
          // Not enough mint events
          console.log('resettting 1')
          range[1] = fromBlock;
        }

        fromBlock = Math.floor((range[0] + range[1]) / 2);
        console.log("fromBlock inside while", fromBlock);
        try {
          mintEvents = await contract.getPastEvents("Mint", {
            fromBlock: fromBlock,
            toBlock: 'latest',
            topics: [null, null, null],
            filter: { minter: this.walletAddress }
          });
          console.log('completed getting mint events inside while statement');
          console.log("mint events inside while", mintEvents);
        } catch (e) {
          mintEvents = null;
          console.log("errors in while loop");
        }
      }
      console.log("exits while loop");

      // We have the latest 10000 mint events
      this.mintedAmount += parseInt(mintEvents.returnValues.amount);
    },
    update() {
      this.checkIsContract();
      this.getTotalSupply();
      this.checkIsMinter();
      this.checkIsPauser();
      this.checkIsOwner();
      this.getFilteredMintEvents();
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

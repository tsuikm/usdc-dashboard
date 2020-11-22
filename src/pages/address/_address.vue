<template>
  <div>
    <NavBar />
    <div>
      <div class="summaryCards">
        <div class="leftSummary">
          <!-- <Address
            :wallet-address="this.walletAddress"
            :is-contract="this.isContract"
            :is-blacklisted="isBlacklisted"
          /> -->
          <div>
            <md-card class="addressContainer">
              <div class="addressCardHeader">
                <div class="heading">
                  <div v-if="this.isContract">
                    <div>CONTRACT</div>
                  </div>
                  <div v-else>
                    <div>ADDRESS</div>
                  </div>
                </div>
              </div>
              <div>
                <img
                  src="@/assets/gray-bar.svg"
                  alt="addressGrayBar"
                  class="addressGrayBar"
                >
              </div>
              <div class="subheading">
                <div>{{ this.walletAddress }}</div>
                <md-icon
                  v-if="this.isBlacklisted"
                  title="Blacklisted"
                >
                  block
                </md-icon>
              </div>
            </md-card>
          </div>
          <div>
            <md-card class="container">
              <div class="card-header">
                <div class="card-subheader">
                  <div class="heading">
                    SUMMARY
                  </div>
                  <div
                    class="role-container"
                    data-testid="role-container"
                  >
                    <div v-if="this.minter">
                      <md-chip class="chip">
                        MINTER
                      </md-chip>
                    </div>
                    <div v-if="this.pauser">
                      <md-chip class="chip">
                        PAUSER
                      </md-chip>
                    </div>
                    <div v-if="this.owner">
                      <md-chip class="chip">
                        OWNER
                      </md-chip>
                    </div>
                  </div>
                </div>
                <div>
                  <img
                    src="@/assets/gray-bar.svg"
                    alt="gray-bar"
                    class="gray-bar"
                  >
                </div>
              </div>
              <div class="card-content">
                <div class="md-layout">
                  <div class="md-layout-items left">
                    <div class="subheading">
                      USDC BALANCE ($)
                    </div>
                    <div class="value">
                      {{ this.balance }}
                    </div>
                  </div>
                </div>
              </div>
            </md-card>
          </div>
        </div>
        <div>
          <md-card class="totalSupplyContainer">
            <div class="totalSupplyCardHeader">
              <div class="heading">
                TOTAL SUPPLY
              </div>
              <div>
                <img
                  src="@/assets/gray-bar.svg"
                  alt="gray-bar"
                  class="gray-bar"
                >
              </div>
            </div>
            <div class="totalSupplyCardContent">
              <div class="subheading">
                PERCENTAGE OF USDC HELD
              </div>
              <div class="value">
                {{ this.usdcPercent }} %
              </div>
            </div>
            <div class="card-footer">
              <div class="subheading">
                TOTAL SUPPLY:
              </div>
              <div class="content">
                {{ this.totalSupply }} USDC
              </div>
            </div>
          </md-card>
        </div>
      </div>
    </div>
    <Transactions :address="this.$route.params.address" />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { padHex } from '@/utils/utils';
import { contract, web3, getBalance, getTotalSupply } from '@/utils/web3utils';
import Transactions from '@/components/Transactions';

export default {
  components: {
    Transactions,
    NavBar,
  },
  props: {
    walletAddress: String,
  },
  data() {
    return {
      balance: null,
      isBlacklisted: false,
      totalSupply: null,
      isContract: null,
      minter: null,
      pauser: null,
      owner: null,
      usdcPercent: null,
    };
  },
  created: function () {
    this.setAddress();
    this.lookupBalance();
    this.lookupBlacklisted();
  },
  updated: function () {
    this.update();
    this.calculatePercentage();
  },
  methods: {
    setAddress() {
      this.walletAddress = this.$route.params.address;
    },
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
    async calculatePercentage() {
      await this.balance;
      var percentage = (this.balance / parseInt(this.totalSupply)) * 100;
      if (percentage < 0.001) {
        this.usdcPercent = '<.001';
      } else {
        this.usdcPercent = Number.parseFloat(percentage).toPrecision(3);
      }
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
.container {
  width: 700px;
  height: 250px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  padding: 30px;
}
.card-header {
  height: 60px;
  letter-spacing: 1px;
  display: flex;
  flex-direction: column;
}
.card-subheader {
  display: flex;
  align-items: center;
}
.card-content {
  height: 140px;
}
.gray-bar {
  width: 800px;
  padding-top: 5px;
}
.chip {
  background-color: #68d7f3;
  margin-left: 20px;
  color: white;
  font-weight: 700;
}
.md-layout-items {
  height: 130px;
  padding-top: 10px;
}
.md-layout-items.left {
  width: 44%;
  display: flex;
  flex-direction: column;
}
.subheading {
  font-weight: 800;
  font-size: 20px;
  color: #a3a3a3;
  height: 50px;
  letter-spacing: 1px;
}
.value {
  font-weight: 900;
  font-size: 65px;
  color: #717171;
}
.totalSupplyContainer {
  width: 500px;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  padding: 30px;
}
.totalSupplyCardHeader {
  height: 60px;
  letter-spacing: 1px;
}
.totalSupplyCardContent {
  height: 145px;
}
.card-footer {
  height: 30px;
  display: flex;
}
.heading {
  font-weight: 800;
  font-size: 24px;
  color: #a3a3a3;
}
.content {
  font-weight: 200;
  font-size: 20px;
  color: #a3a3a3;
  padding-left: 10px;
}
.addressContainer {
  width: 700px;
  height: 120px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  padding: 30px;
  margin-bottom: 30px;
}
.addressCardHeader {
  height: 23px;
  letter-spacing: 1px;
  display: flex;
  flex-direction: column;
}
.addressGrayBar {
  width: 800px;
}
.subheading > div {
  display: inline;
}
.subheading > i {
  margin-bottom: 0.25rem;
}
</style>

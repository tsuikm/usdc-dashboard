<template>
  <div>
    <NavBar />
    <div class="masterminter">
      <div
        class="header"
        data-testid="header"
      >
        Check and Configure Minters
      </div>
      <form @submit.prevent="lookupMinterStatus">
        <md-field class="input-form">
          <md-input
            v-model="address"
            class="input"
            placeholder="Enter address here"
          />
          <md-button
            class="button"
            @click="lookupMinterStatus"
          >
            CHECK STATUS
          </md-button>
        </md-field>
      </form>
      <div
        v-if="this.isMinter"
        class="blacklist-clause"
      > 
        <div> This address is currently a minter. </div>
        <md-field class="input-form">
          <md-input
            v-model="allowance"
            class="input"
            placeholder="Enter allowance here"
          />
          <md-button
            class="button"
            @click="configureMinter"
          >
            INCREASE ALLOWANCE
          </md-button>
        </md-field>
        <md-button @click="removeMinter">
          REMOVE MINTER
        </md-button>
        <div> Click to increase the allowance or remove the minter. </div>
      </div>
      <div
        v-else-if="this.isMinter === false"
        class="minter-clause"
      > 
        <div> This address is not currently a minter. </div>
        <md-field class="input-form">
          <md-input
            v-model="allowance"
            class="input"
            placeholder="Enter allowance here"
          />
          <md-button
            class="button"
            @click="configureMinter"
          >
            CONFIGURE MINTER
          </md-button>
        </md-field>
        <div> Click to configure minter. </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import {
  USDC_CONTRACT_ADDRESS,
  WEB3_BALANCEOF_ADDRESS_LENGTH,
  WEB3_PROVIDER,
  DEFAULT_GAS_PRICE, 
} from '@/utils/constants';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';
import { abi } from '@/utils/web3abi';

const web3 = new Web3(WEB3_PROVIDER || Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'Masterminter',
  components: {
    NavBar,
  },
  data() {
    return {
      address: '',
      allowance: 0,
      isMinter: null,
      accounts: [],
    };
  },
  created: function() {
    this.connectMetamask();
  },
  methods: {
    async connectMetamask() {
      this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    },
    async subscribeToEvent(event) {
      contract.once(event, async () => {
        if (this.address === '') {
          this.isBlacklisted = null;
          return;
        }
        try {
          this.isMinter = await contract.methods
            .isMinter(padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH))
            .call();
        } catch (e) {
          console.error(e);
          this.isMinter = null;
        }
      } );


    },
    async removeMinter() {
      await this.ethReq(contract.methods.removeMinter(this.address).encodeABI());
      this.subscribeToEvent(contract.removeMinterEvent);
    },
    async configureMinter() {
        await this.ethReq(contract.methods.configureMinter(this.address, this.allowance).encodeABI());
        this.subscribeToEvent(contract.configureMinterEvent);
    },
    async lookupMinterStatus() {
      if (this.address === '') {
        this.isMinter = null;
        return;
      }
      try {
        this.isMinter = await contract.methods
          .isMinter(padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH))
          .call();
      } catch (e) {
        console.error(e);
        this.isMinter = null;
      }
    },
    async ethReq(data) {
      try {
        await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: USDC_CONTRACT_ADDRESS,
                data: data,
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          });
      } catch (e) {
        console.error(e);
        //show error
      }
    },
  },
};
</script>

<style scoped>
.masterminter {
  padding: 30px;
  margin: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 50%;
}

.header {
  font-size: 20px;
  font-weight: 900;
  padding-bottom: 3%;
}

.button {
  margin-bottom: 5px;
}

.input-form {
  align-items: center;
}

.minter-clause {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

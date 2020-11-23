<template>
  <div>
    <NavBar />
    <div
      class="header"
      data-testid="header"
    >
      Check and Configure Minters
    </div>
    <div class="master-minter">
      <form
          class="minter-form"
          @submit.prevent="lookupMinterStatus"
        >
        <CustomInput
            v-model="address"
            :placeholder="'Enter address here'"
          />
          <ActionButton
            :label="'CHECK STATUS'"
            :on-click="lookupMinterStatus"
          />
      </form>
        <div
          v-if="this.isMinter && this.minterAllowance !== null"
          class="minter-clause"
        > 
          <div class="minter-message"> 
            This address is currently a minter with allowance {{ this.minterAllowance }}. 
          </div>
          <div
            class="minter-form"
          >
          <CustomInput
              v-model="allowance"
              :placeholder="'Enter allowance here'"
            />
            <ActionButton
              :label="'INCREASE ALLOWANCE'"
              :on-click="configureMinter"
            />
          </div>
          <div class="button">
            <ActionButton
              :label="'REMOVE MINTER'"
              :on-click="removeMinter"
            />
          </div>
          <div class="minter-message"> 
            Click to increase the allowance or remove the minter. 
          </div>
        </div>
        <div
          v-else-if="this.isMinter === false"
          class="minter-clause"
        > 
          <div> This address is not currently a minter. </div>
          <div
            class="minter-form"
          >
          <CustomInput
              v-model="allowance"
              :placeholder="'Enter allowance here'"
            />
            <ActionButton
              :label="'CONFIGURE MINTER'"
              :on-click="configureMinter"
            />
          </div>
          <div class="minter-message"> Click to configure minter. </div>
        </div>
      </div>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import ActionButton from '@/components/ActionButton';
import CustomInput from '@/components/CustomInput';
import {
  USDC_CONTRACT_ADDRESS,
  WEB3_BALANCEOF_ADDRESS_LENGTH,
  WEB3_PROVIDER,
  DEFAULT_GAS_PRICE, 
} from '@/utils/constants';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';
import { abi } from '@/utils/web3utils';

const web3 = new Web3(WEB3_PROVIDER || Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'MasterMinterControl',
  components: {
    NavBar,
    ActionButton,
    CustomInput,
  },
  data() {
    return {
      address: '',
      allowance: 0,
      isMinter: null,
      minterAllowance: null,
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
          this.isMinter = null;
          return;
        }
        try {
          this.isMinter = await contract.methods
            .isMinter(padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH))
            .call();
          if (this.isMinter) {
            this.minterAllowance = await contract.methods
              .minterAllowance(padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH))
              .call();
          }
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
        if (this.isMinter) {
          this.minterAllowance = await contract.methods
            .minterAllowance(padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH))
            .call();
        }
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
.master-minter {
  padding: 30px;
  width: 60%;
  margin: auto;
}

.header {
  font-size: 30px;
  font-weight: 900;
  padding-bottom: 3%;
  line-height: 44px;
}

.minter-clause {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.minter-form {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  margin-top: 20px;
}

.minter-message {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>

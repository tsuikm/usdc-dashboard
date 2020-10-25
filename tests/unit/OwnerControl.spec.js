import OwnerControl from '@/components/OwnerControl.vue';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render } from '@testing-library/vue';

Vue.use(VueMaterial);

describe('OwnerControl', () => {
  it('Text components render properly', () => {
    const { findByText } = render(OwnerControl);
    const header = 'Check and Assign Roles';
    expect(findByText(header)).not.toBeNull();
  });


  it('Displays minter tag if address is a minter', async () => {
    const { getByTestId } = render(OwnerControl, {
      data: function() {
        return {
          address: '0x24bdd8771b08c2ea6fe0e898126e65bd49021be3',
          minter: true,
          pauser: false,
          owner: false,
          blacklister: false,
          newMinter: true,
          newPauser: false,
          newOwner: false,
          newBlacklister: false,
        };
      },
    });
    expect(getByTestId('minter')).not.toBeNull();
  });

  it('Displays owner and pauser tags if address is an owner and a pauser', async () => {
    const { getByTestId } = render(OwnerControl, {
      data: function() {
        return {
          address: '0x24bdd8771b08c2ea6fe0e898126e65bd49021be3',
          minter: false,
          pauser: true,
          owner: true,
          blacklister: false,
          newMinter: false,
          newPauser: true,
          newOwner: true,
          newBlacklister: false,
        };
      },
    });
    expect(getByTestId('owner')).not.toBeNull();
    expect(getByTestId('pauser')).not.toBeNull();
  });

  it('Displays blacklister tag if address is a blacklister', async () => {
    const { getByTestId } = render(OwnerControl, {
      data: function() {
        return {
          address: '0x24bdd8771b08c2ea6fe0e898126e65bd49021be3',
          minter: false,
          pauser: false,
          owner: false,
          blacklister: true,
          newMinter: false,
          newPauser: false,
          newOwner: false,
          newBlacklister: true,
        };
      },
    });
    expect(getByTestId('blacklister')).not.toBeNull();
  });

});

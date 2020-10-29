import BlacklisterControl from '@/components/BlacklisterControl.vue';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render } from '@testing-library/vue';
import { padHex } from '@/utils/utils';

Vue.use(VueMaterial);

describe('BlacklisterControl', () => {
  it('Text components render properly', () => {
    const { findByText } = render(BlacklisterControl);
    const header = 'Check and Blacklist Roles';
    expect(findByText(header)).not.toBeNull();
  });


  it('Displays UNBLACKLIST when blacklisted address is looked up', async () => {
    const { getByText } = render(BlacklisterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isBlacklisted: true,
        };
      },
    });
    expect(getByText('This address is currently blacklisted.')).not.toBeNull();
    expect(getByText('Click to unblacklist.')).not.toBeNull();
  });


  it('Displays BLACKLIST when unblacklisted address is looked up', async () => {
    const { getByText } = render(BlacklisterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isBlacklisted: false,
        };
      },
    });
    expect(getByText('This address is not currently blacklisted.')).not.toBeNull();
    expect(getByText('Click to blacklist.')).not.toBeNull();
  });

});

import BlacklisterControl from '@/components/BlacklisterControl.vue';
import { USDC_CONTRACT_ADDRESS } from '@/utils/constants';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render } from '@testing-library/vue';

Vue.use(VueMaterial);

describe('BlacklisterControl', () => {
  it('Text components render properly', () => {
    const { findByText } = render(BlacklisterControl);
    const header = 'Check and Blacklist Roles';
    expect(findByText(header)).not.toBeNull();
  });

});

import TotalSupply from '@/components/TotalSupply.vue';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render } from '@testing-library/vue';

Vue.use(VueMaterial);

describe('TotalSupply', () => {
  it('Total supply displays correctly', () => {
    const { getByText } = render(TotalSupply);
    expect(getByText('TOTAL SUPPLY')).not.toBeNull();
    expect(getByText('TOTAL SUPPLY:')).not.toBeNull();
  });

  it('Calculates percentage of USDC held', () => {
    const { getByText } = render(TotalSupply);
    expect(getByText('PERCENTAGE OF USDC HELD')).not.toBeNull();
  });
});

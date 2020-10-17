import BalanceCard from '@/components/BalanceCard.vue';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render } from '@testing-library/vue';

Vue.use(VueMaterial);

describe('BalanceCard', () => {
  it('ValueDisplay renders onto BalanceCard', () => {
    const { findByText } = render(BalanceCard);
    expect(findByText('USDC BALANCE ($)')).not.toBeNull();
  });

  it('Displays privileged roles components', () => {
    const { findByTestId } = render(BalanceCard);
    expect(findByTestId('role-container')).not.toBeNull();
  });

  it('Diplays minter badge for minter', () => {
    const { findByTestId, findByText } = render(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: true,
        pauser: false,
        owner: false,
      },
    });

    expect(findByTestId('role-container')).not.toBeNull();
    expect(findByText('MINTER')).not.toBeNull();
  });

  it('Diplays pauser badge for pauser', () => {
    const { findByTestId, findByText } = render(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: false,
        pauser: true,
        owner: false,
      },
    });

    expect(findByTestId('role-container')).not.toBeNull();
    expect(findByText('PAUSER')).not.toBeNull();
  });

  it('Diplays owner badge for owner', () => {
    const { findByTestId, findByText } = render(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: false,
        pauser: false,
        owner: true,
      },
    });

    expect(findByTestId('role-container')).not.toBeNull();
    expect(findByText('OWNER')).not.toBeNull();
  });
});

import BalanceCard from '@/components/BalanceCard.vue';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render } from '@testing-library/vue';

Vue.use(VueMaterial);

describe('BalanceCard', () => {
  it('ValueDisplay renders onto BalanceCard', () => {
    const { queryByText } = render(BalanceCard);
    expect(queryByText('USDC BALANCE ($)')).not.toBeNull();
  });

  it('Displays privileged roles components', () => {
    const { queryByTestId } = render(BalanceCard);
    expect(queryByTestId('role-container')).not.toBeNull();
  });

  it('Diplays minter badge for minter', () => {
    const { queryByTestId, queryByText } = render(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: true,
        pauser: false,
        owner: false,
      },
    });

    expect(queryByTestId('role-container')).not.toBeNull();
    expect(queryByText('MINTER')).not.toBeNull();
  });

  it('Diplays pauser badge for pauser', () => {
    const { queryByTestId, queryByText } = render(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: false,
        pauser: true,
        owner: false,
      },
    });

    expect(queryByTestId('role-container')).not.toBeNull();
    expect(queryByText('PAUSER')).not.toBeNull();
  });

  it('Diplays owner badge for owner', () => {
    const { queryByTestId, queryByText } = render(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: false,
        pauser: false,
        owner: true,
      },
    });

    expect(queryByTestId('role-container')).not.toBeNull();
    expect(queryByText('OWNER')).not.toBeNull();
  });
});

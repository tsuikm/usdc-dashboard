import BalanceCard from '@/components/BalanceCard.vue';
import { render } from '@testing-library/vue';

describe('BalanceCard', () => {
  it('ValueDisplay renders onto BalanceCard', () => {
    const { getByText } = render(BalanceCard);
    expect(getByText('USDC BALANCE ($)')).not.toBeNull();
  });

  it('Displays privileged roles components', () => {
    const { getByTestId } = render(BalanceCard);
    expect(getByTestId('role-container')).not.toBeNull();
  });

  it('Diplays minter badge for minter', () => {
    const { getByTestId, getByText } = render(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: true,
        pauser: false,
        owner: false,
      },
    });

    expect(getByTestId('role-container')).not.toBeNull();
    expect(getByText('MINTER')).not.toBeNull();
  });

  it('Diplays pauser badge for pauser', () => {
    const { getByTestId, getByText } = render(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: false,
        pauser: true,
        owner: false,
      },
    });

    expect(getByTestId('role-container')).not.toBeNull();
    expect(getByText('PAUSER')).not.toBeNull();
  });

  it('Diplays owner badge for owner', () => {
    const { getByTestId, getByText } = render(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: false,
        pauser: false,
        owner: true,
      },
    });

    expect(getByTestId('role-container')).not.toBeNull();
    expect(getByText('OWNER')).not.toBeNull();
  });
});

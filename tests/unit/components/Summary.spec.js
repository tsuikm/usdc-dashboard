import { render, fireEvent, cleanup } from '@testing-library/vue';
import { toHex } from '@/utils/utils';
import Summary from '@/components/Summary.vue';
import { BLOCKCHAIN_PATHS } from '@/utils/constants';

const MOCK_PROPS = {
  roles: [
    {
      name: 'role-1',
      addresses: [ '0x0001' ],
    },
    {
      name: 'role-2',
      addresses: [ '0x0002' ],
    },
    {
      name: 'role-3',
      addresses: [ '0x0003', '0x0004', '0x0005' ],
    },
  ],
  transactions: [ '0x0006', '0x0007', '0x0008' ],
  blocks: [ 100, 99, 98, 97, 96, 95 ],
};

//----------------------------------------------------------------------------------------

describe('Renders Everything Correctly', () => {

  it('Renders labels correctly', () => {
    const { getByText } = render(Summary, { props: MOCK_PROPS });

    expect(getByText('USDC Dashboard')).not.toBeNull();
    expect(getByText('Latest Blocks')).not.toBeNull();
    expect(getByText('Recent Transactions')).not.toBeNull();
    expect(getByText('See all blocks')).not.toBeNull();
    expect(getByText('See all transactions')).not.toBeNull();
  });

  it('Renders blocks correctly', () => {
    const { getByText } = render(Summary, { props: MOCK_PROPS });

    for (const block of MOCK_PROPS.blocks) {
      expect(getByText(`${block} / ${toHex(block)}`)).not.toBeNull();
    }
  });

  it('Renders transactions correctly', () => {
    const { getByText } = render(Summary, { props: MOCK_PROPS });

    for (const transaction of MOCK_PROPS.transactions) {
      expect(getByText(transaction)).not.toBeNull();
    }
  });

  it('Renders Roles correctly', () => {
    const { getByText } = render(Summary, { props: MOCK_PROPS });

    for (const role of MOCK_PROPS.roles) {
      expect(getByText(role.name)).not.toBeNull();

      for (const address of role.addresses) {
        expect(getByText(address)).not.toBeNull();
      }
    }
  });
});

//----------------------------------------------------------------------------------------

describe('Links Route Correctly', () => {

  /**
   * Helper function that tests that a link on the Summary component,
   * rendered with MOCK_PROPS, routes to the correct path.
   *
   * Will test that the link works FOR ALL block-chains (ie. ethereum/algorand/solana).
   *
   * @param {String} label - label displayed for the link (eg. 'See all blocks')
   * @param {String} expectedPath - the expected path when the link is pressed.
   * @return {boolean} - whether or not the test passed. Needed for eslint `expect-expect` rule.
   */
  async function testLink(label, expectedPath) {
    for (const path of BLOCKCHAIN_PATHS) {

      const router = [];
      cleanup();
      const { getByText } = render(Summary, {
        mocks: {
          $router: router,
          $route: { path: path },
        },
        props: MOCK_PROPS,
      });

      await fireEvent.click(getByText(label));

      expect(router[0].path).toEqual(`${path}${expectedPath}`);
    }
    return true;
  }

  //----------------------------------------------------------------------------------------

  it('Labels links', async () => {
    expect(await testLink('See all blocks', '/blocks')).toBe(true);
    expect(await testLink('See all transactions', '/transactions')).toBe(true);
  });


  it('Block links', async () => {
    for (const block of MOCK_PROPS.blocks) {
      expect(await testLink(`${block} / ${toHex(block)}`, `/block/${block}`)).toBe(true);
    }
  });

  it('Transaction links', async () => {
    for (const transaction of MOCK_PROPS.transactions) {
      expect(await testLink(transaction, `/transaction/${transaction}`)).toBe(true);
    }
  });

  it('Roles links', async () => {
    for (const role of MOCK_PROPS.roles) {

      for (const address of role.addresses) {
        expect(await testLink(address, `/address/${address}`)).toBe(true);
      }
    }
  });
});

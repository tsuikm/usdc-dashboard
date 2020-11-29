import {
  fireEvent,
  render,
} from '@testing-library/vue';
import Table from '@/components/Table.vue';

const testProps = {
  name: 'Test Name',
  schema: [{
    name: 'A',
    getter: (i) => i.a,
  },
  {
    name: 'B',
    getter: (i) => i.b,
  },
  ],
  keyField: 'B',
  content: [{
    a: 'Row 1 A',
    b: 'Row 1 B',
  },
  {
    a: 'Row 2 A',
    b: 'Row 2 B',
  },
  ],
};

const testPropsLinks = {
  name: 'Test Name',
  schema: [{
    name: 'A',
    getter: (i) => i.a,
    link: () => '/a-link',
  },
  {
    name: 'B',
    getter: (i) => i.b,
  },
  ],
  keyField: 'B',
  content: [{
    a: 'Row 1 A',
    b: 'Row 1 B',
  },
  {
    a: 'Row 2 A',
    b: 'Row 2 B',
  },
  ],
};

const testPropsLarge = {
  name: 'Test Name',
  schema: [{
    name: 'A',
    getter: (i) => i.a,
  },
  {
    name: 'B',
    getter: (i) => i.b,
  },
  ],
  keyField: 'B',
  content: [],
};

for (let i = 1; i <= 30; i++) {
  testPropsLarge.content.push({
    a: `Row ${i} A`,
    b: `Row ${i} B`,
  });
}

describe('Loading bar', () => {
  it('Loading bar renders if table has not loaded yet', () => {
    const {
      getByTestId,
    } = render(Table, {
      props: {
        ...testProps,
        loading: true,
      },
    });
    expect(getByTestId('progress-bar-test-id')).not.toBeNull();
  });
  it('Loading bar disappears after table renders', () => {
    const {
      queryByTestId,
    } = render(Table, {
      props: {
        ...testProps,
        loading: false,
      },
    });

    expect(queryByTestId('progress-bar-test-id')).toBeNull();
  });

});

describe('Table', () => {
  it('Renders labels correctly', () => {
    const {
      getByText,
    } = render(Table, {
      props: testProps,
    });

    expect(getByText('A')).not.toBeNull();
    expect(getByText('B')).not.toBeNull();
  });

  it('Renders entries correctly', async () => {
    const {
      getByText,
    } = render(Table, {
      props: testProps,
    });

    expect(getByText('Row 1 A')).not.toBeNull();
    expect(getByText('Row 1 B')).not.toBeNull();
    expect(getByText('Row 2 A')).not.toBeNull();
    expect(getByText('Row 2 B')).not.toBeNull();
  });

  it('Renders links correctly', async () => {
    const {
      getByText,
    } = render(Table, {
      props: testPropsLinks,
    });

    const a1 = getByText('Row 1 A');
    const b1 = getByText('Row 1 B');
    const a2 = getByText('Row 2 A');
    const b2 = getByText('Row 2 B');

    expect(a1.tagName).toBe('A');
    expect(a2.tagName).toBe('A');
    expect(a1.getAttribute('to')).toBe('/a-link');
    expect(a2.getAttribute('to')).toBe('/a-link');

    expect(b1.tagName).not.toBe('A');
    expect(b2.tagName).not.toBe('A');
  });

  it('Pagination functionality', async () => {
    const {
      getByText,
    } = render(Table, {
      props: testPropsLarge,
    });

    expect(getByText('Row 1 A')).not.toBeNull();
    expect(getByText('Row 1 B')).not.toBeNull();
    expect(getByText('Row 25 A')).not.toBeNull();
    expect(getByText('Row 25 B')).not.toBeNull();

    await fireEvent.click(getByText('navigate_next'));

    expect(getByText('Page 2 of 2')).not.toBeNull();
    expect(getByText('Row 26 A')).not.toBeNull();
    expect(getByText('Row 26 B')).not.toBeNull();
    expect(getByText('Row 30 A')).not.toBeNull();
    expect(getByText('Row 30 B')).not.toBeNull();
  });

  it('Pagination Query Parameter Tests', async () => {
    const router = [];

    const { findByText, getByText } = render(Table, {
      props: testPropsLarge,
      mocks: {
        $route: {
          query: {
            page: 2, // Load with ?page=2
          },
        },
        $router: router,
      },
    });

    // Ensure that page 2 is loaded.
    expect(await findByText('Page 2 of 2')).not.toBeNull();
    expect(await findByText('Row 26 A')).not.toBeNull();
    expect(await findByText('Row 26 B')).not.toBeNull();
    expect(await findByText('Row 30 A')).not.toBeNull();
    expect(await findByText('Row 30 B')).not.toBeNull();

    // Press the back button once.
    await fireEvent.click(getByText('navigate_before'));

    // Ensure that the page query parameter changed to ?page=1.
    expect(router.length).toBe(1);
    expect(router[0].query.page).toBe(1);

    // Ensure page 1 is loaded.
    expect(getByText('Row 1 A')).not.toBeNull();
    expect(getByText('Row 1 B')).not.toBeNull();
    expect(getByText('Row 25 A')).not.toBeNull();
    expect(getByText('Row 25 B')).not.toBeNull();
  });
});

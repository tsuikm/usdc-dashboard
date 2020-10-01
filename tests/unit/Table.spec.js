import { render, fireEvent } from '@testing-library/vue';
import Table from '../../src/components/Table.vue';
import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial);

const testProps = {
  name: 'Test Name',
  totalItems: 300,
  schema: {
    A: (i) => i.a,
    B: (i) => i.b,
  },
  keyField: 'B',
  content: [
    {
      a: 'Row 1 A',
      b: 'Row 1 B'
    },
    {
      a: 'Row 2 A',
      b: 'Row 2 B'
    }
  ]
}

const testPropsLinks = {
  name: 'Test Name',
  totalItems: 30,
  schema: {
    A: (i) => ({
      value: i.a,
      link: '/a-link'
    }),
    B: (i) => i.b,
  },
  keyField: 'B',
  content: [
    {
      a: 'Row 1 A',
      b: 'Row 1 B'
    },
    {
      a: 'Row 2 A',
      b: 'Row 2 B'
    }
  ]
}

const testPropsLarge = {
  name: 'Test Name',
  totalItems: 30,
  schema: {
    A: (i) => i.a,
    B: (i) => i.b,
  },
  keyField: 'B',
  content: []
}

for (let i = 1; i <= 30; i++) {
  testPropsLarge.content.push({
    a: `Row ${i} A`,
    b: `Row ${i} B`,
  })
}

describe('Table', () => {
  it('Renders labels correctly', () => {
    const { getByText } = render(Table, { props: testProps });

    getByText('A');
    getByText('B');
  });

  it('Renders entries correctly', async () => {
    const { getByText } = render(Table, { props: testProps });

    getByText('Row 1 A');
    getByText('Row 1 B');
    getByText('Row 2 A');
    getByText('Row 2 B');
  });

  it('Renders links correctly', async () => {
    const { getByText } = render(Table, { props: testPropsLinks });

    const a1 = getByText('Row 1 A');
    const b1 = getByText('Row 1 B');
    const a2 = getByText('Row 2 A');
    const b2 = getByText('Row 2 B');

    expect(a1).toBeInstanceOf(HTMLAnchorElement)
    expect(a2).toBeInstanceOf(HTMLAnchorElement)
    expect(a1.getAttribute('href')).toBe('/a-link')
    expect(a2.getAttribute('href')).toBe('/a-link')
    expect(b1).not.toBeInstanceOf(HTMLAnchorElement)
    expect(b2).not.toBeInstanceOf(HTMLAnchorElement)
  });

  it('Pagination functionality', async () => {
    const { getByText } = render(Table, { props: testPropsLarge });

    getByText('Row 1 A');
    getByText('Row 1 B');
    getByText('Row 25 A');
    getByText('Row 25 B');

    await fireEvent.click(getByText('navigate_next'));

    getByText('Page 2 of 2');

    getByText('Row 26 A');
    getByText('Row 26 B');
    getByText('Row 30 A');
    getByText('Row 30 B');
  });
});

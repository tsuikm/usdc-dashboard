import RoleButton from '@/components/RoleButton';
import Vue from 'vue';
import { render, createEvent, fireEvent } from '@testing-library/vue';

describe('RoleButton', () => {
  it('Title renders properly', () => {
    const { findByText } = render(RoleButton, {
      propsData: {
        title: 'MINTER',
        roleActive: true,
        onClick: function () {
          //button clicked
        },
      },
    });
    expect(findByText('MINTER')).not.toBeNull();
  });

  it('Fires event on click', () => {
    const { getByText } = render(RoleButton, {
      propsData: {
        title: 'MINTER',
        roleActive: true,
        onClick: function () {
          //button clicked
        },
      },
    });
    const event = createEvent.click(getByText('MINTER'));
    expect(fireEvent(getByText('MINTER'), event)).not.toBeNull();
  });

});

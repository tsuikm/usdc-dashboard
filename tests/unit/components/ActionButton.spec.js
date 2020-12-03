import ActionButton from '@/components/ActionButton';
import { render, createEvent, fireEvent } from '@testing-library/vue';

describe('ActionButton', () => {
  it('Title renders properly', () => {
    const { findByText } = render(ActionButton, {
      propsData: {
        label: 'TEST',
        onClick: function () {
          //button clicked
        },
      },
    });
    expect(findByText('TEST')).not.toBeNull();
  });

  it('Fires event on click', () => {
    const { getByText } = render(ActionButton, {
      propsData: {
        label: 'TEST',
        onClick: function () {
          //button clicked
        },
      },
    });
    const event = createEvent.click(getByText('TEST'));
    expect(fireEvent(getByText('TEST'), event)).not.toBeNull();
  });

});

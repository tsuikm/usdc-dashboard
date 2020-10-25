import PauserControl from '@/components/PauserControl.vue';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render } from '@testing-library/vue';

Vue.use(VueMaterial);

describe('PauserControl', () => {
  it('Text components render properly', () => {
    const { findByText } = render(PauserControl);
    const header = 'Pause and Unpause Contract';
    expect(findByText(header)).not.toBeNull();
  });


  it('Displays unpause button when contract is paused', async () => {
    const { getByTestId, getByText } = render(PauserControl, {
      data: function() {
        return {
          contractPaused: true,
        };
      },
    });
    expect(getByTestId('unpause-button')).not.toBeNull();
    expect(getByText('All transfers, minting, and burning are PAUSED.')).not.toBeNull();
  });


  it('Displays pause button when contract is unpaused', async () => {
    const { getByTestId, getByText } = render(PauserControl, {
      data: function() {
        return {
          contractPaused: false,
        };
      },
    });
    expect(getByTestId('pause-button')).not.toBeNull();
    expect(getByText('All transfers, minting, and burning are ACTIVE.')).not.toBeNull();
  });

});

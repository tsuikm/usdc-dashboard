import { render } from '@testing-library/vue';
import transfers from '@/pages/transfers/index';
import Vue from 'vue';
import VueMaterial from 'vue-material';

Vue.use(VueMaterial);

describe('Transfers page', () => {
  test('Transfers card renders', async () => {
    const { queryByTestId } = render(transfers);
    expect(queryByTestId('transfers-card-test-id')).not.toBeNull();
    expect(queryByTestId('transfers-card-to-input')).not.toBeNull();
    expect(queryByTestId('transfers-card-from-input')).not.toBeNull();
    expect(queryByTestId('transfers-card-amount-input')).not.toBeNull();
    expect(queryByTestId('transfers-card-send-button')).not.toBeNull();
  });    

});

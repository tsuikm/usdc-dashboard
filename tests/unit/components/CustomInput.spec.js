import CustomInput from '@/components/CustomInput';
import { render } from '@testing-library/vue';

describe('CustomInput', () => {
  it('Has correct input', () => {
    const { findByText } = render(CustomInput, {
      propsData: {
        placeholder: 'test placeholder',
        input: 'test input',
      },
    });
    expect(findByText('test placeholder')).not.toBeNull();
    expect(findByText('test input')).not.toBeNull();
  });
});

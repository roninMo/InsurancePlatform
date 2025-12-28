import { render } from '@testing-library/react';

import AddressInfo from './AddressInfo';

describe('AddressInfo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddressInfo />);
    expect(baseElement).toBeTruthy();
  });
});

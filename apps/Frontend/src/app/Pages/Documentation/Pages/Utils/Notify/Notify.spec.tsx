import { render } from '@testing-library/react';

import Notify from './Notify';

describe('Notify', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Notify />);
    expect(baseElement).toBeTruthy();
  });
});

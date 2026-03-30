import { render } from '@testing-library/react';

import Hashbar from './Hashbar';

describe('Hashbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Hashbar />);
    expect(baseElement).toBeTruthy();
  });
});

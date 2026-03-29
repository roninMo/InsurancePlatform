import { render } from '@testing-library/react';

import QuickLinks from './QuickLinks';

describe('QuickLinks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QuickLinks />);
    expect(baseElement).toBeTruthy();
  });
});

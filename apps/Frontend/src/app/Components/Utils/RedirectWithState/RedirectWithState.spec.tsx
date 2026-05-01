import { render } from '@testing-library/react';

import RedirectWithState from './RedirectWithState';

describe('RedirectWithState', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RedirectWithState />);
    expect(baseElement).toBeTruthy();
  });
});

import { render } from '@testing-library/react';

import Tech from './Tech';

describe('Tech', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tech />);
    expect(baseElement).toBeTruthy();
  });
});

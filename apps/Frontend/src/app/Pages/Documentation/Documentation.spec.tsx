import { render } from '@testing-library/react';

import Documentation from './Documentation';

describe('Documentation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Documentation />);
    expect(baseElement).toBeTruthy();
  });
});

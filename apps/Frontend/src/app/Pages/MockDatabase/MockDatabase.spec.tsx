import { render } from '@testing-library/react';

import MockDatabase from './MockDatabase';

describe('MockDatabase', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MockDatabase />);
    expect(baseElement).toBeTruthy();
  });
});

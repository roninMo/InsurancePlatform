import { render } from '@testing-library/react';

import InputHandler from './InputHandler';

describe('InputHandler', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputHandler />);
    expect(baseElement).toBeTruthy();
  });
});
